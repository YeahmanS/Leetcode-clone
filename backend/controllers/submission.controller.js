import { db } from "../utils/db.js"

const getAllSubmission = async(req,res) => {
    try {
        const userId = req.user.id

        const submissions = await db.submission.findmany({
            where:{
                userId:userId
            }
        })

        res.status(200).json({
            message:"submission fetched successfully",
            submissions
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"error while fetching submissions"
        })
    }
}

const getSubmissionForProblem = async (req,res)=>{
    try {

        const userId = req.user.id
        const problemId = req.params.problemId
        const submission = await db.submission.findmany({
            where : {
                userId : userId,
                problemId : problemId,
            }
        })

        res.status(200).json({
            message:"submission fetched succesfully",
            submission
        })

    } catch (error) {
        console.log(error)
        req.status(500).json({
            message: "Error while fetching problem by id"
        })
        
    }
}

const getAllSubmissionForProblem = async (req,res) => {
    try {
        const problemId = req.params.problemId
        const submission = await db.submission.count({
            where : {
                problemId:problemId
            }
        })

        res.status(200).json({
            message : "All Submission fetched for problem"
        })

    } catch (error) {
        
        console.log(error)
        req.status(500).json({
            message: "error while fetching all submission"
        })
    }
}

export { getAllSubmission, getSubmissionForProblem, getAllSubmissionForProblem }