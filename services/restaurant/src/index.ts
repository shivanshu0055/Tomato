import express from 'express'
import connectDB from './config/db.js'
import dotenv from 'dotenv'
import restaurantRouter from './routes/restaurant.js'
import cors from 'cors'
import menuItemsRouter from './routes/menuItems.js'
import cartRouter from './routes/cart.js'
import addressRouter from './routes/address.js'
import orderRouter from './routes/order.js'
import { connectRabbitMQ } from './config/rabbitmq.js'
import { startPaymentConsumer } from './config/paymentConsumer.js'

dotenv.config()

await connectRabbitMQ()
startPaymentConsumer()

const PORT=process.env.PORT || 5001
const app=express()
app.use(cors())
app.use(express.json())

app.use("/api/restaurant",restaurantRouter)
app.use("/api/menu-items",menuItemsRouter)
app.use("/api/cart",cartRouter)
app.use("/api/address",addressRouter)
app.use("/api/order",orderRouter)

app.listen(PORT,()=>{
    console.log(`Restaurant service running on port ${PORT}`)
    connectDB()
})