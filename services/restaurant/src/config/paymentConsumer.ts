import Order from "../model/Order.js";
import {getChannel} from "./rabbitmq.js";

export const startPaymentConsumer = async () => {
    const channel=getChannel();

    channel.consume(process.env.PAYMENT_QUEUE_NAME as string,async (msg)=>{
        if(!msg) return;

        try{
            const event=JSON.parse(msg.content.toString());
            if(event.type!=="PAYMENT_SUCCESSFUL"){
                channel.ack(msg)
                return;
            }
            const orderId=event.data.orderId;
            const paymentId=event.data.paymentId;
            const provider=event.data.provider;
            const order=await Order.findOneAndUpdate({ _id: orderId, paymentStatus : {$ne:"paid"} }, {$set: { paymentStatus: "paid",status:"placed" },$unset:{expiresAt:1} } ,{ new: true })

            if(!order){
                channel.ack(msg)
                return;
             }

            console.log("Order Placed from Rabbit MQ",order._id)

            // socket work
            channel.ack(msg)
            }
        catch(error){
            console.error("Error occurred while processing payment event (Rabbit MQ) :", error);
        
        }
    })
}