import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import pool from "./db.js"

import authRoutes from "./routes/authRoutes.js"

dotenv.config(); // configuration done to allow .env variable using process.env

const app = express();

app.use(cors());
// Client sends request → Server receives it ✅

// Server processes request → Sends response back ✅

// Response arrives at browser → Browser checks headers ✅

// If CORS headers missing/wrong → Browser says: "I received this, but I won't let the JavaScript code have it" ❌

// JavaScript gets CORS error → Cannot access the actual response data
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("Server is running...")
})

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{
    console.log(`server is listening on port ${PORT}`);
})

const connectToDB = async() => {
    const result = await pool.query("SELECT NOW()");
    console.log("Currect time for DB : " , result.rows[0]);
}

connectToDB();


app.use("/auth", authRoutes);