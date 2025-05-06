import axios from 'axios';

const getJudge0LanguageId = (language) =>{
    const languageMap = {
        "PYTHON" : 71,
        "JAVA" : 62,
        "JAVASCRIPT" : 63
    }

    return languageMap[language.toUpperCase()]
}

const submitBatch = async (submissions) => {
    const {data} = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,{
         submissions
     })

    return data
}

const sleep = (ms) => new Promise((resolve)=> setTimeout(resolve , ms))

const pollBatchResults = async (tokens)=>{
    while(true){
        const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`,{
            params:{
                tokens:tokens.join(","),
                base64_encoded:false,
            }
        })

        const results = data.submissions;

        const isAllDone = results.every(
            (res)=> res.status.id !== 1 && res.status.id !== 2
        )

        if(isAllDone) return results
        await sleep(1000)
    }
}

const getLanguageName = (language) => {
    const LANGUAGE_NAME = {
        74: "TypeScript",
        63: "JavaScript",
        71: "Python",
        62: "Java",
    }

    return LANGUAGE_NAME(language) || "Unknown"

}

export {getJudge0LanguageId , submitBatch, pollBatchResults, getLanguageName }