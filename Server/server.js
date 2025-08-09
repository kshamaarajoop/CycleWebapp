const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const app = express();

import cors from 'cors';

// Middleware
app.use();
app.use(bodyParser.json());

// Firebase Admin Setup
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// PostgreSQL Connection
const pool = new Pool({
  user: '',
  host: '',
  database: '',
  password: '',
  port: '',
});

// Onboarding Endpoint
app.post('/api/onboarding', 
  async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decodedToken = await admin.auth().verifyIdToken(token);
    const { age, weight, height, periodStartDate, cycleLength, symptomsTracking } = req.body;

    const result = await pool.query(
      `INSERT INTO user_onboarding (
        user_id, age, weight, height, 
        period_start_date, cycle_length, symptoms_tracking
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [decodedToken.uid, age, weight, height, periodStartDate, cycleLength, symptomsTracking]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Add this to your server.js after the pool setup
const { setupDatabase } = require('./database-setup');

// Run database setup on server start
setupDatabase().catch(console.error);
