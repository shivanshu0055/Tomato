import amqp from 'amqplib';

let channel: amqp.Channel;

export const connectRabbitMQ = async()=>{
    const connection=await amqp.connect(process.env.RABBITMQ_URL as string)
    channel=await connection.createChannel()
    await channel.assertQueue(process.env.PAYMENT_QUEUE_NAME as string,{durable:true})
    console.log("Connected to RabbitMQ inside restaurant service 🐇")
}

export const getChannel = (): amqp.Channel => channel