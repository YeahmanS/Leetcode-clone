import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../utils/judge0.js"
import {db} from "../utils/db.js";

const createProblem = async (req,res)=>{
    try {

        const {title,description,difficulty,tags,examples,constraints,testcases,codeSnippets,referenceSolutions} = req.body

        if (req.user.role !== "ADMIN" ){
            return res.status(403).json({
                error : "You are not permitted to create a problem"
            })
        }

        for(const [language , solutionCode] of Object.entries(referenceSolutions)){
            
            const languageId = getJudge0LanguageId(language)

            if(!languageId){ return res.status(400).json({message:`${language} is not supported yet :( `})}

            const submission = testcases.map(({input , output})=>({
                source_code : solutionCode,
                language_id : languageId,
                stdin : input,
                expected_output : output
            }))

            const submissionResult = await submitBatch(submission)

            const tokens = submissionResult.map((res) => res.token)

            const result = await pollBatchResults(tokens)

            for (let i = 0; i < result.length; i++) {
                const each_result = result[i];
        
                if (each_result.status.id !== 3) {
                  return res
                    .status(400)
                    .json({
                      error: `Testcase ${i + 1} failed for language ${language}`,
                    });
                }
              }
              
        }
            const newProblem = await db.problem.create({
                data: { title, description, difficulty, tags, examples, constraints, testcase : testcases, codeSnippets, referenceSolutions, userId: req.user.id,
                }
              });
        
            return res.status(201).json(newProblem);
        
    } catch (error) {
        console.log("Error while creating a problem",error)
        res.status(500).json({
            message : "Something went wrong while creating a problem"
        })
    }
}

const getAllProblem = async (req,res)=>{
    try {

        const problems = await db.problem.findMany()
        
        if(!problems){
            res.status(401).json({
                message:"Problem not found"
            })
        }

        return res.status(200).json({
            message:"Here are all of your problem",
            problems
        })
        

        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Got error while fetching problems"
        })
    }
}

const getProblemById = async (req,res)=>{
    try {
        const id = req.params.id

        const problem = await db.problem.findUnique({
            where:{id}
        })

        if(!problem){
            res.status(401).json({
                message:"Problem not found"
            })
        }

        return res.status(200).json({
            message:"Here is your problem",
            problem
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Error while getting problem by id"
        })
        
    }
}

const updateProblem = async (req,res)=>{
    try {
        const id = req.params.id 

        const {title,description,difficulty,tags,examples,constraints,testcases,codeSnippets,referenceSolutions} = req.body

        const problem = await db.problem.findUnique({
            where:{id}
        })

        if(!problem){
            res.status(401).json({
                message:"Problem not found"
            })
        }

        for(const [language , solutionCode] of Object.entries(referenceSolutions)){
            
            const languageId = getJudge0LanguageId(language)

            if(!languageId){ return res.status(400).json({message:`${language} is not supported yet :( `})}

            const submission = testcases.map(({input , output})=>({
                source_code : solutionCode,
                language_id : languageId,
                stdin : input,
                expected_output : output
            }))

            const submissionResult = await submitBatch(submission)

            const tokens = submissionResult.map((res) => res.token)

            const result = await pollBatchResults(tokens)

            for (let i = 0; i < result.length; i++) {
                const each_result = result[i];
        
                if (each_result.status.id !== 3) {
                  return res
                    .status(400)
                    .json({
                      error: `Testcase ${i + 1} failed for language ${language}`,
                    });
                }
              }
        
            }

        const updatedProblem = await db.problem.update({
            where : {id},
            data : {
                title, description, difficulty, tags, examples, constraints, testcase : testcases, codeSnippets, referenceSolutions, userId: req.user.id
            }
        })

        return res.status(201).json({
            message:"Updated Problem successfully",
            updatedProblem
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Error while updating problem"
        })
    }
}

const deleteProblem = async (req,res)=>{
    try {
        const id = req.params.id

        const problem = await db.problem.findUnique({
            where:{id}
        })

        if(!problem){
            res.status(401).json({
                message:"Problem not found"
            })
        }

        const deletedProblem = await db.problem.delete({
            where:{id}
        })

        return res.status(200).json({
            message:"Deleted Problem successfully",
            deletedProblem
        })

    } catch (error) {
        console.log(error)
        res.status(200).json({
            message:"Error while deleting problem"
        })
    }
}

const problemSolvedByUser = async (req,res)=>{
    try {
        
    } catch (error) {
        
    }
}

export {createProblem,getAllProblem,getProblemById,deleteProblem,updateProblem,problemSolvedByUser}