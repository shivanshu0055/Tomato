import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import tryCatch from "../middlewares/tryCatch.js";
import Address from "../model/Address.js";
import Cart from "../model/Cart.js";
import { IRestaurant, Restaurant } from "../model/Restaurant.js";
import {IMenuItem} from "../model/MenuItems.js"
import Order from "../model/Order.js";

function getDistance(lat1:number, lon1:number, lat2:number, lon2:number) {
    const R = 6371; // Earth radius in km

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

export const createOrder = tryCatch(async(req:AuthenticatedRequest,res) => {
    const user=req.user

    if(!user){
        return res.status(401).json({message:"Unauthorized"})
    }

    const {addressId}=req.body
    
    if(!addressId){
        return res.status(400).json({message:"Address Id is required"})
    }

    const address=await Address.findOne({ _id: addressId, userId: user._id })

    if(!address){
        return res.status(404).json({message:"Address not found"})
    }

    const cartItems=await Cart.find({ userId: user._id }).populate<{itemId:IMenuItem}>("itemId").populate<{restaurantId:IRestaurant}>("restaurantId")

    if(cartItems.length===0){
        return res.status(400).json({message:"Cart is empty"})
    }

    const firstCartItem=cartItems[0]

    if(!firstCartItem){
        return res.status(400).json({message:"Cart is empty"})
    }

    if(!firstCartItem.restaurantId){
        return res.status(400).json({message:"Invalid cart item"})
    }

    const restaurantId=firstCartItem.restaurantId._id

    const restaurant=await Restaurant.findById(restaurantId)

    if(!restaurant){
        return res.status(404).json({message:"Restaurant not found"})
    }

    if(!restaurant.isOpen){
        return res.status(400).json({message:"Restaurant is closed"})
    }

    let subTotal=0

    cartItems.forEach((cartItem) => {
        if(cartItem.itemId && 'price' in cartItem.itemId){
            subTotal+=cartItem.quantity * cartItem.itemId.price
        }
    })

    let deliveryFee=subTotal<250?50:0

    const expiresAt=new Date(Date.now()+15*60*1000)

    const [latitude,longitude]=address.location.coordinates

    const distance=getDistance(latitude,longitude,restaurant.autoLocation.coordinates[0],restaurant.autoLocation.coordinates[1])

    const riderAmount=Math.ceil((distance)*20)

    const order=await Order.create({
    userId: user._id.toString(),
    restaurantId: restaurant._id.toString(),
    restaurantName: restaurant.name,
    riderId: null,
    riderPhone: null,
    riderName: null,
    riderAmount,
    subTotal,
    deliveryFee,
    grandTotal: subTotal + deliveryFee,
    addressId: address._id.toString(),
    deliveryAddress: {
        formattedAddress: address.formattedAddress,
        mobile: address.mobile,
        latitude,
        longitude
    },
    distance,
    status:"placed",
    paymentStatus:"pending",
    expiresAt,
    cartItems: cartItems.map((cartItem) => ({
            itemId: cartItem.itemId?._id.toString() || "",
            name: cartItem.itemId && 'name' in cartItem.itemId ? cartItem.itemId.name : "Unknown Item",
            price: cartItem.itemId && 'price' in cartItem.itemId ? cartItem.itemId.price : 0,
            quantity: cartItem.quantity
        }))
    })

    await Cart.deleteMany({ userId: user._id })

    // Not sending entire order details to client for security reasons, only sending orderId and amount
    res.status(201).json({message:"Order placed successfully",orderId:order._id.toString(),amount:order.grandTotal})
})

export const fetchOrderForPayment=tryCatch(async(req:AuthenticatedRequest,res)=>{
    const user=req.user
    if(!user){
        return res.status(401).json({message:"Unauthorized"})
    }

    if(req.headers["x-internal-key"]!==process.env.INTERNAL_SERVICE_KEY){
        return res.status(403).json({message:"Forbidden"})
    }

    const order=await Order.findById(req.params.orderId)

    if(!order){
        return res.status(404).json({message:"Order not found"})
    }

    if(order.paymentStatus!=="pending"){
        return res.status(400).json({message:"Payment already processed for this order"})
    }

    res.status(200).json({orderId:order._id.toString(),amount:order.grandTotal,currency:"INR"})
})

