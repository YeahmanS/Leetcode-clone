import { Router } from "express";
import { authMiddlware, roleMiddleware } from "../middlewares/auth.middleware.js";
import { createProblem, getAllProblem, getProblemById, deleteProblem, updateProblem, problemSolvedByUser } from "../controllers/problem.controller.js";

const problemRouter = new Router()

problemRouter.post("/create-problem",authMiddlware,roleMiddleware,createProblem)
problemRouter.get("/get-all-problem",authMiddlware,getAllProblem)
problemRouter.get("/get-problem/:id",authMiddlware,getProblemById)
problemRouter.put("/update-problem/:id",authMiddlware,roleMiddleware,updateProblem)
problemRouter.delete("/delete-problem/:id",authMiddlware,roleMiddleware,deleteProblem)
problemRouter.get("/get-solved-problem",authMiddlware,problemSolvedByUser)

export default problemRouter