import {db} from "../utils/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {UserRole} from "../generated/prisma/index.js"

const registerUser = async (req,res) => {
    const {name,email,password} = req.body

    try {
        const existingUser = await db.user.findUnique({
            where : {
                email
            }
        })

        if(existingUser){
            res.status(400).json({
                message : "user already exist"
            })
        }

        const hashedpassword = await bcrypt.hash(password,10)

        const newUser = await db.user.create({
            data : {
                name,
                email,
                password:hashedpassword,
                role:UserRole.USER
            }
        })

        const token = jwt.sign({id:newUser.id},process.env.JWT_SECRET,{expiresIn:"7d"})

        res.cookie("jwt" , token , {
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV !== "development",
            maxAge:1000 * 60 * 60 * 24 * 1 // 1 days
            })


        res.status(201).json({
            success:true,
            message:"User created successfully",
            user:{
                id:newUser.id,
                email:newUser.email,
                name:newUser.name,
                role:newUser.role
            }
            })

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
             error:"Error creating user"
         })
    }

}

const loginUser = async (req,res) => {
    const {email,password} = req.body

    try {
        const user = await db.user.findUnique({
            where : {email}
        })

        if(!user){
            return res.status(400).json({
                message:"User do not exist"
            })
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(400).json({
                message:"Invalid credentials"
            })
        }

        const token = jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:"7d"})

        res.cookie("jwt",token,{
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV !== "development",
            maxAge:1000 * 60 * 60 * 24 * 1 // 1 days
            })

        res.status(200).json({
            success:true,
            message:"User logged in ",
            user : {
                id : user.id,
                email:user.email,
                role:user.role,
                name:user.name

            }
        })


    } catch (error) {
        console.log("Error while logging in ",error);
        res.status(500).json({
            message:"Error while logging in"
        })
    }
}

const logoutUser = async (req,res) => {
    try {
        res.clearCookie("jwt",{
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV !== "development",
        })

        res.status(200).json({
            success:true,
            message:"User logged out"
        })
    } catch (error) {
        
        console.log("Errror while logging user out:",error)
        res.status(500).json({
            message:"Error logging user out"
        })
    }
}

const checkUser = async (req,res) => {
    try {
        res.status(200).json({
            success:true,
            message:"User authenticated succesfully",
            user:req.user
        })
    } catch (error) {
        console.log("Got error while checking",error)
        res.status(500).json({
            message:"Error while checking user"
        })
        
    }
}

export {registerUser,loginUser,logoutUser,checkUser}