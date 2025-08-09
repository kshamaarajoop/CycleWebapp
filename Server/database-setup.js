// database-setup.js
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: process.env.DB_USER || '',
  host: process.env.DB_HOST || '',
  database: process.env.DB_NAME || '',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || '',
});

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Setting up database triggers...');

    // Create the triggers
    const triggerSql = `
      -- Updated_at trigger function
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- Apply updated_at triggers
      DROP TRIGGER IF EXISTS update_user_onboarding_updated_at ON user_onboarding;
      CREATE TRIGGER update_user_onboarding_updated_at 
          BEFORE UPDATE ON user_onboarding 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_cycle_logs_updated_at ON cycle_logs;
      CREATE TRIGGER update_cycle_logs_updated_at 
          BEFORE UPDATE ON cycle_logs 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      -- Cycle length calculation function
      CREATE OR REPLACE FUNCTION calculate_average_cycle_length()
      RETURNS TRIGGER AS $$
      DECLARE
          avg_cycle_length INTEGER;
          cycle_count INTEGER;
      BEGIN
          SELECT 
              ROUND(AVG(DATE_PART('day', end_date - start_date) + 1))::INTEGER,
              COUNT(*)
          INTO avg_cycle_length, cycle_count
          FROM (
              SELECT start_date, end_date 
              FROM cycle_logs 
              WHERE uid = NEW.uid 
              ORDER BY start_date DESC 
              LIMIT 5
          ) recent_cycles;

          IF cycle_count > 0 AND avg_cycle_length IS NOT NULL THEN
              UPDATE user_onboarding 
              SET 
                  cycle_length = avg_cycle_length,
                  updated_at = CURRENT_TIMESTAMP
              WHERE user_id = NEW.uid;
          END IF;

          RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- Apply cycle calculation triggers
      DROP TRIGGER IF EXISTS calculate_cycle_length_on_insert ON cycle_logs;
      CREATE TRIGGER calculate_cycle_length_on_insert
          AFTER INSERT ON cycle_logs
          FOR EACH ROW EXECUTE FUNCTION calculate_average_cycle_length();

      -- Validation function
      CREATE OR REPLACE FUNCTION validate_cycle_data()
      RETURNS TRIGGER AS $$
      BEGIN
          IF NEW.start_date >= NEW.end_date THEN
              RAISE EXCEPTION 'Start date must be before end date';
          END IF;

          IF NEW.cycle_length IS NOT NULL AND (NEW.cycle_length < 21 OR NEW.cycle_length > 45) THEN
              RAISE EXCEPTION 'Cycle length must be between 21 and 45 days';
          END IF;

          IF TG_TABLE_NAME = 'user_onboarding' AND (NEW.age < 10 OR NEW.age > 100) THEN
              RAISE EXCEPTION 'Age must be between 10 and 100';
          END IF;

          RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- Apply validation triggers
      DROP TRIGGER IF EXISTS validate_cycle_logs_data ON cycle_logs;
      CREATE TRIGGER validate_cycle_logs_data
          BEFORE INSERT OR UPDATE ON cycle_logs
          FOR EACH ROW EXECUTE FUNCTION validate_cycle_data();

      DROP TRIGGER IF EXISTS validate_onboarding_data ON user_onboarding;
      CREATE TRIGGER validate_onboarding_data
          BEFORE INSERT OR UPDATE ON user_onboarding
          FOR EACH ROW EXECUTE FUNCTION validate_cycle_data();
    `;

    await client.query(triggerSql);
    console.log('✅ Database triggers created successfully!');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('🎉 Database setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupDatabase };
