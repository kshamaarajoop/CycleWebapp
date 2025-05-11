/*
CREATE TABLE cycle_logs (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(100) REFERENCES users(uid),
  start_date DATE,
  end_date DATE,
  flow TEXT,
  mood TEXT,
  pain_level INT
);

*/




app.post("/api/log-cycle", verifyToken, async (req, res) => {
  const { uid } = req.user;
  const { start_date, end_date, flow, mood, pain_level } = req.body;

  try {
    await db.query(
      "INSERT INTO cycle_logs (uid, start_date, end_date, flow, mood, pain_level) VALUES ($1, $2, $3, $4, $5, $6)",
      [uid, start_date, end_date, flow, mood, pain_level]
    );
    res.send({ success: true });
  } catch (err) {
    console.error("❌ Error saving cycle log:", err.message);
    res.status(500).send("Server error");
  }
});

app.get("/api/cycle-logs", verifyToken, async (req, res) => {
  const { uid } = req.user;

  try {
    const result = await db.query(
      "SELECT * FROM cycle_logs WHERE uid = $1 ORDER BY start_date DESC",
      [uid]
    );
    res.send(result.rows);
  } catch (err) {
    console.error("❌ Error fetching logs:", err.message);
    res.status(500).send("Server error");
  }
});
