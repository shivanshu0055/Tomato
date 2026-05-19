import axios from "axios";
import getBuffer from "../config/datauri.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import tryCatch from "../middlewares/tryCatch.js";
import { Restaurant } from "../model/Restaurant.js";
import MenuItem from "../model/MenuItems.js";

export const addMenuItem=tryCatch(async(req:AuthenticatedRequest,res)=>{
    const user=req.user
    if(!user){
        res.status(401).json({message:'Unauthorized'})
        return;
    }
    const restaurant=await Restaurant.findOne({ownerId:user._id})

    if(!restaurant){
        res.status(404).json({message:'Restaurant not found'})
        return;
    }

    const {name,description,price}=req.body

    if(!name || !description || !price){
        res.status(400).json({message:'All fields are required'})
        return;
    }

    const file=req.file

    if (!file) {
        res.status(400).json({ message: 'Please upload an image' })
        return
    }

    const fileBuffer = getBuffer(file)

    if (!fileBuffer) {
        res.status(400).json({ message: 'Invalid image file' })
        return
    }

    const { data: uploadResult } = await axios.post(`${process.env.UTILS_BACKEND_URL}/api/upload`, {
        buffer: fileBuffer.content,
    })

    const newMenuItem=await MenuItem.create({
        restaurantId: restaurant._id,
        name,
        description,
        price,
        image: uploadResult.url
    })      

    res.status(201).json({
        message:'Menu item added successfully', 
        menuItem: newMenuItem
    })

})

export const getAllItems=tryCatch(async(req:AuthenticatedRequest,res)=>{
    const user=req.user
    if(!user){
        res.status(401).json({message:'Unauthorized'})
        return;
    }
    const {id}=req.params
    if(!id){
        res.status(400).json({message:'Restaurant id is required'})
        return;
    }
    const items=await MenuItem.find({restaurantId:id}).sort({createdAt:-1})
    res.status(200).json({items})
})

export const deleteMenuItem=tryCatch(async(req:AuthenticatedRequest,res)=>{
    const user=req.user
    if(!user){
        return res.status(401).json({message:'Unauthorized'})
    }
    const {id}=req.params
    if(!id){
        return res.status(400).json({message:'Menu item id is required'})
    }
    const menuItem=await MenuItem.findById(id)
    if(!menuItem){
        return res.status(404).json({message:'Menu item not found'})
    }
    const restaurant=await Restaurant.findById(menuItem.restaurantId)
    if(!restaurant){
        return res.status(404).json({message:'Restaurant not found'})
    }
    if(restaurant.ownerId.toString()!==user._id.toString()){
        return res.status(403).json({message:'Forbidden'})
    }
    await menuItem.deleteOne()
    res.status(200).json({message:'Menu item deleted successfully'})
})

export const toggleMenuItemAvailability=tryCatch(async(req:AuthenticatedRequest,res)=>{
    const user=req.user 
    if(!user){
        return res.status(401).json({message:'Unauthorized'})

    }
    const {id}=req.params
    if(!id){
        return res.status(400).json({message:'Menu item id is required'})
    }
    const menuItem=await MenuItem.findById(id)
    if(!menuItem){
        return res.status(404).json({message:'Menu item not found'})
    }
    const restaurant=await Restaurant.findById(menuItem.restaurantId)
    if(!restaurant){
        return res.status(404).json({message:'Restaurant not found'})
    }
    if(restaurant.ownerId.toString()!==user._id.toString()){
        return res.status(403).json({message:'Forbidden'})
    }
    menuItem.isAvailable=!menuItem.isAvailable
    await menuItem.save()
    res.status(200).json({message:'Menu item availability toggled successfully', menuItem})

})