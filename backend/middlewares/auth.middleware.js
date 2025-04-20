import jwt  from "jsonwebtoken";
import { db } from "../utils/db.js";


const authMiddlware = async (req,res,next) => {

    try {
    
        const token = req.cookies.jwt

        if(!token){
            return res.status(401).json({
                message : "Unauthorized - No token provided"
            })
        }

        let decoded ;

        try {
            decoded = jwt.verify(token,process.env.JWT_SECRET)
        } catch (error) {
            return res.status(401).json({
                message : "Unauthorized - Invalid token"
            })
        }

        const user = await db.user.findUnique({
            where : {
                id:decoded.id
            },
            select : {
                id:true,
                name:true,
                role:true,
                email:true
            }
        })

        if(!user){
            return res.status(404).json({
                message : "User not found"
            })
        }

        req.user = user

        next();

        
    } 
    catch (error) {
        console.log("Error while authenticating user",error)
        res.status(500).json({
            message : "Error in authentication middleware"
        })
    }
}

export {authMiddlware}