import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import tryCatch from "../middlewares/tryCatch.js";
import Address from "../model/Address.js";

export const addAddress=tryCatch(async(req:AuthenticatedRequest,res)=>{
    const user=req.user

    if(!user){
        return res.status(401).json({message:"Unauthorized"})
    }

    const {mobile,formattedAddress,latitude,longitude}=req.body

    if(!mobile || !formattedAddress || !latitude || !longitude){
        return res.status(400).json({message:"All fields are required"})
    }

    const newAddress=await Address.create({
        userId:user._id,
        mobile,
        formattedAddress,
        location:{
            type:"Point",
            coordinates:[Number(longitude),Number(latitude)]
        }
    })

    res.status(201).json({message:"Address added successfully",address:newAddress})
})

export const deleteAddress=tryCatch(async(req:AuthenticatedRequest,res)=>{  
    const user=req.user

    if(!user){
        return res.status(401).json({message:"Unauthorized"})
    }

    const addressId=req.params.id

    const address=await Address.findById(addressId)

    if(!address){
        return res.status(404).json({message:"Address not found"})
    }

    if(address.userId.toString()!==user._id.toString()){
        return res.status(403).json({message:"Forbidden"})
    }

    await Address.findByIdAndDelete(addressId)

    res.status(200).json({message:"Address deleted successfully"})
})


export const fetchMyAddresses=tryCatch(async(req:AuthenticatedRequest,res)=>{
    const user=req.user
    if(!user){
        return res.status(401).json({message:"Unauthorized"})
    }
    const addresses=await Address.find({userId:user._id})
    res.status(200).json({message:"Addresses fetched successfully",addresses})
})

export const updateAddress=tryCatch(async(req:AuthenticatedRequest,res)=>{
    const user=req.user
    if(!user){
        return res.status(401).json({message:"Unauthorized"})
    }
    const addressId=req.params.id
    const address=await Address.findById(addressId)

    if(!address){
        return res.status(404).json({message:"Address not found"})
    }

    if(address.userId.toString()!==user._id.toString()){
        return res.status(403).json({message:"Forbidden"})
    }

    const {mobile,formattedAddress,latitude,longitude}=req.body

    if(!mobile || !formattedAddress || !latitude || !longitude){
        return res.status(400).json({message:"All fields are required"})
    }

    address.mobile=mobile
    address.formattedAddress=formattedAddress
    address.location={
        type:"Point",
        coordinates:[Number(longitude),Number(latitude)]
    }

    await address.save()
    
    res.status(200).json({message:"Address updated successfully",address})
})