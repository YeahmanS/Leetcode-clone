
import { pollBatchResult, submitBatch } from '../utils/judge0.js'

const executeCode = async (req,res) => {
    try {
        
        const {source_code , language_id, stdin, expected_outputs, problemId} = req.body

        const userId = req.user.id 

        if(
            !Array.isArray(stdin) ||
            stdin.length === 0 ||
            !Array.isArray(expected_outputs) ||
            stdin.length !== expected_outputs.length
        ){
            return res.status(400).json({
                message : "Invalid or Missing test case"
            })
        }

        const submissions = stdin.map((input)=>({
            source_code,
            language_id,
            stdin : input
        }))

        const submitResponse = await submitBatch(submissions)

        const tokens = submitResponse.map((res)=>res.token)

        const results = await pollBatchResult(tokens)

        res.status(200).json({
            message:"Code Executed!",
            results
        })

    } catch (error) {
        console.log(error)
        req.status(500).json({
            message:"Error while submitting a problem"
        })
        
    }
}

export {executeCode}