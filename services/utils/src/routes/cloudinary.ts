import express from 'express'
import cloudinary from 'cloudinary'
import { Request,Response } from 'express';
const cloudinaryRouter=express.Router();

cloudinaryRouter.post("/",async (req: Request, res: Response)=>{
    try{
        const {buffer}=req.body
        const cloud=await cloudinary.v2.uploader.upload(buffer)

        res.json({
            url:cloud.secure_url
        })
    }
    catch(error){
        console.error(error)
        res.status(500).json({error:"Failed to upload image"})
    }
})

export default cloudinaryRouter;