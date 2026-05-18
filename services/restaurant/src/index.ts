import express from 'express'
import connectDB from './config/db.js'
import dotenv from 'dotenv'
dotenv.config()

const PORT=process.env.PORT || 5001
const app=express()

app.listen(PORT,()=>{
    console.log(`Restaurant service running on port ${PORT}`)
    connectDB()
})