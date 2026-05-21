import { Request, Response } from "express";
import axios from "axios";
import Razorpay from "razorpay";
import { razorpayInstance } from "../config/razorpay.js";
import { verifyRazorpaySignature } from "../config/verifyRazorpay.js";
import { publishPaymentSuccess } from "../config/payment.producer.js";
import { log } from "console";
import { AuthenticatedRequest } from "../middleware/isAuth.js";

export const createRazorpayOrder=async (req:AuthenticatedRequest,res:Response)=>{
    try{
        const {orderId}=req.body
        
        const {data}=await axios.get(`${process.env.RESTAURANT_BACKEND_URL}/api/order/payment/${orderId}`,{
            headers:{
                "Authorization":`Bearer ${req.headers.authorization?.split(" ")[1]}`,
                "x-internal-key":process.env.INTERNAL_SERVICE_KEY as string
            },
        })

        console.log("Speaking from createRazorPayOrder")

        const razorpayOrder=await razorpayInstance.orders.create({
            amount:data.amount,
            currency:data.currency,
            receipt:orderId,
        })

        res.status(200).json({razorpayOrderId:razorpayOrder.id,key:process.env.RAZORPAY_API_KEY})
    }
    catch(err){
        console.error("Error creating Razorpay order:", err);
        res.status(500).json({error:"Failed to create Razorpay order",message:err instanceof Error ? err.message : "Unknown error"})
    }
}

export const verifyRazorpayPayment=async (req:AuthenticatedRequest,res:Response)=>{
    const {razorpayOrderId,razorpayPaymentId,razorpaySignature,orderId}=req.body

    const isValid=verifyRazorpaySignature(razorpayOrderId,razorpayPaymentId,razorpaySignature)

    if(!isValid){
        return res.status(400).json({message:"Payment verification failed"})
    }
    
    await publishPaymentSuccess({
        orderId,
        paymentId:razorpayPaymentId,
        provider:"razorpay"
    })

    res.json({message:"Payment verified successfully"})
}

