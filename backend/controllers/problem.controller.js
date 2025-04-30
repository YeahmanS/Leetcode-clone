import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../utils/judge0"

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

            const newProblem = await db.problem.create({
                data: { title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions, userId: req.user.id,
                }
              });
        
            return res.status(201).json(newProblem);
        }
        
    } catch (error) {
        console.log("Error while creating a problem",error)
        res.status(500).json({
            message : "Something went wrong while creating a problem"
        })
    }
}

const getAllProblem = async (req,res)=>{
    try {
        
    } catch (error) {
        
    }
}

const getProblemById = async (req,res)=>{
    try {
        
    } catch (error) {
        
    }
}

const updateProblem = async (req,res)=>{
    try {
        
    } catch (error) {
        
    }
}

const deleteProblem = async (req,res)=>{
    try {
        
    } catch (error) {
        
    }
}

const problemSolvedByUser = async (req,res)=>{
    try {
        
    } catch (error) {
        
    }
}

export {createProblem,getAllProblem,getProblemById,deleteProblem,updateProblem,problemSolvedByUser}