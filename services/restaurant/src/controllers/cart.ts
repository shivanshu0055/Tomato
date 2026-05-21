import mongoose from "mongoose";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import tryCatch from "../middlewares/tryCatch.js";
import Cart from "../model/Cart.js";

export const addToCart=tryCatch(async(req:AuthenticatedRequest,res)=>{
    const user=req.user
    if(!user){
        return res.status(401).json({message:"Unauthorized"})
    }
    
    const userId=user._id
    const {restaurantId,itemId}=req.body

    if(!mongoose.Types.ObjectId.isValid(restaurantId) || !mongoose.Types.ObjectId.isValid(itemId)){
        return res.status(400).json({message:"Invalid restaurantId or itemId"})
    }

    const cartFromDifferentRestaurant=await Cart.findOne({userId,restaurantId:{$ne:restaurantId}})

    if(cartFromDifferentRestaurant){
        return res.status(400).json({message:"You have items from a different restaurant in your cart. Please clear your cart before adding items from another restaurant."})
    }

    const cartItem=await Cart.findOneAndUpdate({userId,restaurantId,itemId},{$inc:{quantity:1},$setOnInsert:{userId,restaurantId,itemId}},{new:true,upsert:true,setDefaultsOnInsert:true})

    res.status(200).json({message:"Item added to cart",cart:cartItem})
    
})


export const fetchMyCart=tryCatch(async(req:AuthenticatedRequest,res)=>{
    const user=req.user
    
    if(!user){ 
        return res.status(401).json({message:"Unauthorized"})
    }

    const userId=user._id

    const cartItems=await Cart.find({userId}).populate("itemId").populate("restaurantId")

    let subTotal=0
    let cartLength=0
    cartItems.forEach((cartItem)=>{
        const itemPrice=(cartItem.itemId as any).price
        subTotal+=itemPrice*cartItem.quantity
        cartLength+=cartItem.quantity
    })

    res.status(200).json({success:true,cart:cartItems,subTotal,cartLength})

})

export const removeFromCart=tryCatch(async(req:AuthenticatedRequest,res)=>{
    const user=req.user
    if(!user){
        return res.status(401).json({message:"Unauthorized"})
    }

    const userId=user._id
    const { itemId } = req.body

    if(!mongoose.Types.ObjectId.isValid(itemId)){
        return res.status(400).json({message:"Invalid itemId"})
    }

    const cartItem = await Cart.findOne({ userId, itemId })
    if(!cartItem){
        return res.status(404).json({ message: 'Item not found in cart' })
    }

    if(cartItem.quantity > 1){
        cartItem.quantity -= 1
        await cartItem.save()
        return res.status(200).json({ message: 'Item quantity decreased', cart: cartItem })
    }

    await cartItem.deleteOne()
    return res.status(200).json({ message: 'Item removed from cart' })
})