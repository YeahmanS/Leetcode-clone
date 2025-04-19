import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT ?? 8000

app.use(express.json())

app.get("/",(req,res)=>{
    res.status(200).json({
        message : "Welcome to CloneCode"
    })
})

app.listen(PORT,()=>{
    console.log("Listing on PORT :",PORT)
})