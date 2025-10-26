import {Router} from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db"

const router = Router();

router.post("/signup", async(req,res) => {
    const {name , email , password} = req.body;


    console.log(name);
    try {
        
        console.log("Database URL:", process.env.DATABASE_URL);
        const existingUsers = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        // Add this to your db.ts temporarily

        if(existingUsers.rows.length > 0)
            return res.status(400).json({ message: "User already Exists"});

        const hashed = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
            [name, email, hashed]
        );
        
        // requested and something got created in the table (201)
        res.status(201).json({message: "User Created", user : newUser.rows[0]});


    }catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
});

router.post("/login",async(req,res)=>{
    const {email, password} = req.body;

    try{
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]            
        );

        const user = result.rows[0];
        if(!user) return res.status(400).json({message: "User Not Found"});

        const isValid = await bcrypt.compare(password, user.password);
        if(!isValid) return res.status(400).json({message: "Invalid Credentials"});

        const token = jwt.sign(
            {id: user.id, email: user.email},
            process.env.JWT_SECRET as string,
            {expiresIn: "1h"}
        );

        // res is by default set to 200 
        res.json({message: "Login succesfull", token});

    }catch(err){
        console.error(err);
        res.status(500).json({message : "Internal Server error"});
    }
})

export default router;