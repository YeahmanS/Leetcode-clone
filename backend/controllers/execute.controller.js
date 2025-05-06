
import { all } from 'axios'
import { getLanguageName, pollBatchResult, submitBatch } from '../utils/judge0.js'
import {db} from "../utils/db.js";

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

        let allPassed = true

        const detailedResults = results.map((result, i) => {
            const stdout = result.stdout.trim()
            const expected_output = expected_outputs[i].trim()
            const passed = stdout === expected_output

            if(!passed){
                allPassed = false
            }

            return {
                testCase : i+1 ,
                passed,
                stdout,
                expected:expected_output,
                stderr: result.stderr || null ,
                compile_output : result.compile_output || null ,
                status : result.status.description ,
                memory : result.memory ? `${result.memory}KB` : undefined ,
                time : result.time ? `${result.time} s` : undefined
            }

        })

        console.log(detailedResults)

        const submission = await db.submission.create({
            data : {
                userId,
                problemId,
                sourceCode : source_code,
                language : getLanguageName(language_id),
                stdin : stdin.join("\n"),
                stdout : JSON.stringify(detailedResults.map((r)=>r.stdout)),
                stderr : detailedResults.some((r)=>r.stderr) 
                ? JSON.stringify(detailedResults.map((r)=>r.stderr)) : null ,
                compileOutput : detailedResults.some((r)=>r.compile_output) 
                ? JSON.stringify(detailedResults.map((r)=>r.compile_output)) : null ,
                status : allPassed ? "Accepted" : "Wrong Answer" ,
                memory : detailedResults.some((r) => r.memory )
                ? JSON.stringify(detailedResults.map( (r)=> r.memory)) : null ,
                time : detailedResults.some((r)=> r.time) 
                ? JSON.stringify(detailedResults.map((r)=>r.time)) : null }


            })

        if (allPassed){
            await db.problemSolved.upsert({
                where : {
                    userId_problemId : {
                        userId,
                        problemId
                    }
                },
                update : {},
                create : {
                    userId,
                    problemId
                }
            })
        }

        const testCaseResults = detailedResults.map((result) => ({
            submissionId : submission.id,
            testCase: result.testCase,
            passed : result.passed,
            stdout : result.stdout,
            expected : result.expected,
            stderr : result.stderr,
            compileOutput : result.compile_output,
            status:result.status,
            memory:result.memory,
            time:result.time
        }))

        await db.testCaseResult.result({
            data : testCaseResults
        })

        const submissionWithTestCase = await db.submission.findUnique({
            where: {
              id: submission.id,
            },
            include: {
              testCases: true,
            },
          });

        res.status(200).json({
            message:"Code Executed!",
            submission: submissionWithTestCase,
        })

    } catch (error) {
        console.log(error)
        req.status(500).json({
            message:"Error while submitting a problem"
        })
        
    }
}

export {executeCode}