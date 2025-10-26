import { Router } from "express"
import pool from "../db"
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticateToken , async(req,res) => {
    const user = (req as any).user;
    const { title , content } =  req.body;

    try {
        const result = await pool.query(
            "INSERT INTO notes (user_id, title, conent) VALUES ($1, $2, $3) RETURNING *",
            [user.id, title, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({message : "Internal Server Error"});
    }
})

// useless
router.get("/:id", authenticateToken, async(req,res)=>{
    const user = (req as any).user;

    try{
        const result = await pool.query(
            "SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC",
            [user.id]
        );
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message : "Internal server error"});
    }
})

 

