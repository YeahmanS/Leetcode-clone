import { Router } from "express";
import { checkUser, loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";
import { authMiddlware } from "../middlewares/auth.middleware.js";

const authRouter = new Router() ; 

authRouter.post("/register",registerUser)
authRouter.post("/login",loginUser)
authRouter.post("/logout",authMiddlware,logoutUser)
authRouter.get("/check",authMiddlware,checkUser)

export default authRouter