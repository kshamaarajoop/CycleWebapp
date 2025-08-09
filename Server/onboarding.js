// CREATE TABLE user_onboarding (
//   id SERIAL PRIMARY KEY,
//   user_id VARCHAR(255) NOT NULL,
//   age INTEGER NOT NULL,
//   weight DECIMAL(5,2) NOT NULL,
//   height INTEGER NOT NULL,
//   period_start_date DATE NOT NULL,
//   cycle_length INTEGER NOT NULL,
//   symptoms_tracking BOOLEAN NOT NULL DEFAULT false,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//   CONSTRAINT fk_user
//     FOREIGN KEY(user_id) 
//     REFERENCES users(uid) 
// );

import 'dotenv/config';
import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;

import admin from 'firebase-admin';

const router = express.Router();

// Temporary CORS fix - move this to your main server file
router.use((req, res, next) => {
  // res.header('Access-Control-Allow-Origin', 'http://localhost:5175');
  // res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  // res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// PostgreSQL pool configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',   
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'CycleApp',
  password: process.env.DB_PASSWORD || 'sqlishu',
  port: process.env.DB_PORT || 5432, 
});

// Save onboarding data
router.post('/', async (req, res) => {
  try {
    // Verify Firebase token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const { age, weight, height, periodStartDate, cycleLength, symptomsTracking } = req.body;

    // Validate input
    if (!age || !weight || !height || !periodStartDate || !cycleLength) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Insert into PostgreSQL
    const result = await pool.query(
      `INSERT INTO user_onboarding (
        user_id, age, weight, height, 
        period_start_date, cycle_length, symptoms_tracking
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
       ON CONFLICT (user_id) 
       DO UPDATE SET
        age = EXCLUDED.age,
        weight = EXCLUDED.weight,
        height = EXCLUDED.height,
        period_start_date = EXCLUDED.period_start_date,
        cycle_length = EXCLUDED.cycle_length,
        symptoms_tracking = EXCLUDED.symptoms_tracking,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *`,
      [userId, age, weight, height, periodStartDate, cycleLength, symptomsTracking || false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
