import { getChannel } from "./rabbitmq.js"

export const publishPaymentSuccess = async (payload : {
    orderId:string,
    paymentId:string,
    provider:"razorpay"
})=>{
    try{
        const channel=getChannel()
        channel.sendToQueue(process.env.PAYMENT_QUEUE_NAME as string,Buffer.from(JSON.stringify({
            type:"PAYMENT_SUCCESSFUL",
            data:payload
        })),
        {persistent:true})
    }
    catch(err){
        console.error("Failed to publish payment success message:", err);
    }
}