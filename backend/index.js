import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const PORT = process.env.PORT ?? 8000

app.use(express.json())
app.use(cookieParser())

app.use("/api/v1/auth",authRouter)

app.listen(PORT,()=>{
    console.log("Listing on PORT :",PORT)
})