import express from 'express'
import connectDB from './config/db.js'
import dotenv from 'dotenv'
import restaurantRouter from './routes/restaurant.js'
import cors from 'cors'
import menuItemsRouter from './routes/menuItems.js'

dotenv.config()

const PORT=process.env.PORT || 5001
const app=express()
app.use(cors())
app.use(express.json())

app.use("/api/restaurant",restaurantRouter)
app.use("/api/menu-items",menuItemsRouter)
 
app.listen(PORT,()=>{
    console.log(`Restaurant service running on port ${PORT}`)
    connectDB()
})