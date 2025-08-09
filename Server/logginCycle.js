// logginCycle.cjs
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const admin = require('firebase-admin');

// PostgreSQL connection (could also import from server.cjs)
const pool = new Pool({
  user: '',
  host: '',
  database: '',
  password: '',
  port: '',
});

// Log cycle endpoint
router.post("/log-cycle", async (req, res) => {
  const { uid } = req.user;
  const { start_date, end_date, flow, mood, pain_level } = req.body;

  try {
    await pool.query(
      "INSERT INTO cycle_logs (uid, start_date, end_date, flow, mood, pain_level) VALUES ($1, $2, $3, $4, $5, $6)",
      [uid, start_date, end_date, flow, mood, pain_level]
    );
    res.send({ success: true });
  } catch (err) {
    console.error("❌ Error saving cycle log:", err.message);
    res.status(500).send("Server error");
  }
});

// Get cycle logs endpoint
router.get("/cycle-logs", async (req, res) => {
  const { uid } = req.user;

  try {
    const result = await pool.query(
      "SELECT * FROM cycle_logs WHERE uid = $1 ORDER BY start_date DESC",
      [uid]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching cycle logs:", err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
