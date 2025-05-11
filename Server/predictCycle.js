import { calcualteNextPeriod, getCyclePhases } from "./cycleUtils";


//for predictions
/* User Cycle info Table required!!!! 


CREATE TABLE users_cycle_deets (
  uid VARCHAR(100) PRIMARY KEY REFERENCES users(uid),
  cycle_length INT,
  period_duration INT,
  last_period_start DATE
);





*/
app.get('/api/predictCycle',verifyToken,async(req,res)=>{
  const { uid } = req.user;
  console.log("🔥 Predict Cycle Request Received:");
  console.log("UID:", uid);
  try {
    const result = await db.query("SELECT * FROM users_cycle_deets WHERE uid=$1", [uid]);
    console.log("Postgres lookup:", result.rows);

    if (result.rows.length === 0) {
      return res.status(404).send("Cycle data not found");
    }
    //cycle length needs to be calculated with the average of last 5 cycles else only the last cycle will be used
    //const { start_date, end_date } = result.rows[0];

    const user = result.rows[0];
    const { cycle_length, period_duration } = user;
    const nextPeriodStartDate = calcualteNextPeriod(startDate, cycle_length);
    const nextPeriodEndDate = new Date(nextPeriodStartDate);
    nextPeriodEndDate.setDate(nextPeriodStartDate.getDate() + period_duration - 1);

    const cyclePhases = getCyclePhases(startDate, EndDate, cycle_length);

    res.send({
      success: true,
      action: "cycle_prediction",
      data: {
        next_period_start_date: nextPeriodStartDate,
        next_period_end_date: nextPeriodEndDate,
        cycle_phases: cyclePhases,
      },
    });
  } catch (error) {
    console.error("❌ Error predicting cycle:", error.message);
    res.status(500).send("Internal Server Error");
  }
});