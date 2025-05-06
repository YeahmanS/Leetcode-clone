import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


import authRouter from "./routes/auth.route.js";
import problemRouter from "./routes/problem.route.js";
import executeRouter from "./routes/executeCode.route.js"
import submissionRouter from "./routes/submission.route.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT ?? 8000

app.use(express.json())
app.use(cookieParser())

app.use("/api/v1/auth",authRouter)
app.use("/api/v1/problems",problemRouter)
app.use("/api/v1/execute-code",executeRouter)
app.use("/api/v1/submission",submissionRouter)

app.listen(PORT,()=>{
    console.log("Listing on PORT :",PORT)
})