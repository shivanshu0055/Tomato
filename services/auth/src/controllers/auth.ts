import User from "../model/user.js";
import jwt from "jsonwebtoken";
import tryCatch from "../middlewares/tryCatch.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import { oauth2client } from "../config.ts/googleConfig.js";
import axios from "axios";

export const loginUser = tryCatch(async(req,res)=>{
    const {code}=req.body

    if(!code){
        res.status(400).json({
            "message":"Authorization code is required"
        })
        return;
    }

    const googleResponse=await oauth2client.getToken(code)
    
    oauth2client.setCredentials(googleResponse.tokens)

    const userRes=await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`)

    const {email,name,picture}=userRes.data

    let user=await User.findOne({
        email
    })

    if(!user){
        user=await User.create({
            email,
            name,
            image:picture
        })
    }

    const token = jwt.sign({user},process.env.JWT_SECRET as string,{
        expiresIn:"15d"
    });


    res.status(200).json({
        "message":"Login successful",
        "token":token,
        "user":user
    })
})


const allowdRoles=['customer','rider','seller']
type Role = (typeof allowdRoles)[number]

export const addUserRole=tryCatch(async(req:AuthenticatedRequest,res)=>{
    if(!req.user){
        res.status(401).json({
            "message":"Unauthorized"
        })
        return;
    }

    const { role }: { role: Role } = req.body

    if(!role || !allowdRoles.includes(role)){
        res.status(400).json({
            "message":"Invalid role"
        })
        return;
    }

    const user= await User.findByIdAndUpdate(req.user._id,{role},{new:true})

    if(!user){
        res.status(404).json({
            "message":"User not found"
        })
        return;
    }

    const token = jwt.sign({user},process.env.JWT_SECRET as string,{
            expiresIn:"15d"
    });

    res.status(200).json({
        "message":"Role updated successfully",
        "user":user,
        "token":token
    })
})

export const myProfile=tryCatch(async(req:AuthenticatedRequest,res)=>{
    if(!req.user){
        res.status(401).json({ 
            "message":"Unauthorized"
        })
        return;
    }

    res.status(200).json({
        "message":"Profile retrieved successfully",
        "user":req.user
    })
})