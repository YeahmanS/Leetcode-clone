import { getJudge0LanguageId } from "../utils/judge0"

const createProblem = async (req,res)=>{
    try {

        const {title,description,difficulty,tags,examples,constraints,testcases,codeSnippets,referenceSolutions,} = req.body

        if (req.user.role !== "ADMIN" ){
            return res.status(403).json({
                error : "You are not permitted to create a problem"
            })
        }

        for(const [language , solutionCode] of Object.entries(referenceSolutions)){
            
            const languageId = getJudge0LanguageId(language)

            if(!languageId){ return res.status(400).json({message:`${language} is not supported yet :( `})}

            

        }
        
    } catch (error) {
        
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