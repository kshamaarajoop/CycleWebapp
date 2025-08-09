import express from "express";
import admin from "./firebase.js";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();


const app = express();
const port = 3000;

app.use(cors())
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname));
app.use("/src", express.static(path.join(__dirname, "src")));

const db = new pg.Client({
  user: "postgres",
  password: "sqlishu",
  host: "localhost",
  port: 5432,
  database: "CycleApp",
});
db.connect();
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

async function verifyToken(req,res,next){
  const idToken=req.headers.authorization;
  if(!idToken){
    return res.status(401).send("Unauthorised");
  }
  try{
    const decodedToken= await admin.auth().verifyIdToken(idToken);
   console.log("✅ Decoded Token:", decodedToken); // Check  what’s inside

    req.user=decodedToken;
    next();

  }catch(error){
    console.error("111Error in Sign-in:", error.code, error.message, error);

    return res.status(401).send("Unauthorised");
  }
}

app.post("/api/signup",verifyToken,async(req,res)=>{
  let isNewUser=false;
  const{uid, name, email}=req.user;
  console.log("🔥 Signup Request Received:");
  console.log("UID:", uid);
  console.log("Name:", name);
  console.log("Email:", email);
 try{
  const result = await db.query("SELECT * FROM users WHERE uid=$1", [uid]);
console.log("Postgres lookup:", result.rows);

if (result.rows.length === 0) {
  await db.query(
    "INSERT INTO users (uid, name, email) VALUES ($1, $2, $3)",
    [uid, name, email]
  );
  console.log("✅ User inserted into DB");
  isNewUser=true;
}
  res.send({sucess:true,uid,name:name,email,NewUser:isNewUser});
 }
 catch (err) {
  console.log("Error in Sign-in:", err.code, err.message, err);
  res.status(500).send("Server error");
}
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default verifyToken;
