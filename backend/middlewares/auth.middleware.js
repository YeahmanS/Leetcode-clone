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

const roleMiddleware = async (req,res,next)=>{
    try {
        const userId = req.user.id

        const user = await db.user.findUnique({
            where:{
                id:userId
            },
            select:{
                role:true
            }
        })

        if(!user || user.role !== "ADMIN" ){
            return res.status(403).json({
                message: "Access denied admins only"
            })
        }

        next();

    } catch (error) {
        console.log("Error within Role Middleware",error)
        res.status(500).json({
            message:"Error while checking user role"
        })
    }
}

export {authMiddlware , roleMiddleware}