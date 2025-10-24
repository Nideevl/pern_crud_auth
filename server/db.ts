import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

//Extracts the Pool class used for managing DB connections
const {Pool} =  pkg;

//Creates a reusable DB connection object
const pool = new Pool({
    connectionString : process.env.DATABASE_URL,
});

pool.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err) => console.log("Caught an Error : ",err));

export default pool;