import { Router } from "express";
import { authMiddlware } from "../middlewares/auth.middleware.js";
import { executeCode } from "../controllers/execute.controller.js";

const executeCodeRouter = new Router()

executeCodeRouter.post("/",authMiddlware,executeCode)

export default executeCodeRouter