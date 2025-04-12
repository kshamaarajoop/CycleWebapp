import express from "express";
import admin from "./firebase.js";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import verifyToken from "./userSignUp.js";
import dotenv from "dotenv";
dotenv.config();
const app=express();

const db = new pg.Client({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
});
db.connect();

app.post("/api/onboarding",verifyToken,async(req,res)=>{
  const {uid}=req.user;
  const {age,weight,height,cycleLength,periodDuration,sexualActivity,sympotms /*symptoms befire and after your period */}=req.body;
  try{
    await db.query("Insert into user_details(uid,age,weight,height,cycle_length,period_duration,symptoms) values ($1,$2,$3,$4,$5,$6,$7) on conflict (uid) do update set age=$2,weight=$3,height=$4,cycle_length=$5,period_duration=$6,symptoms=$7",[age,weight,height,cycleLength,periodDuration,sexualActivity,sympotms]);
    /* on conflict allows updates if the user has already fille the form once */
    res.send({success:true,action:
      "onboarding_complete"
    });
  }catch(err){
    console.log("❌ Error storing onboarding data:", err.message)
    res.status(500).send("Internal Server Error");
  }
})