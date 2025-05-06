import {Router} from "express";
import { authMiddlware } from "../middlewares/auth.middleware.js";
import { getAllSubmission, getAllSubmissionForProblem , getSubmissionForProblem } from "../controllers/submission.controller.js";

const submissionRouter = new Router()

submissionRouter.get("/get-all-submission",authMiddlware,getAllSubmission)
submissionRouter.get("/get-submission/:problemId",authMiddlware,getSubmissionForProblem)
submissionRouter.get("/get-all-submission/:problemId",authMiddlware,getAllSubmissionForProblem)

export default submissionRouter
