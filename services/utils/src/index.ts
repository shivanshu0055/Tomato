import express from 'express';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary'
import cors from 'cors';
import cloudinaryRouter from './routes/cloudinary.js';


dotenv.config();

const app = express();

app.use(cors())
app.use(express.json({limit:'10mb'}))
app.use(express.urlencoded({limit:'10mb',extended:true}))

const { CLOUDE_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = process.env

if(!CLOUDE_NAME || !CLOUD_API_KEY || !CLOUD_API_SECRET){
    console.error("Cloudinary configuration variables are missing. Please check your .env file.");
    process.exit(1);
}

cloudinary.v2.config({
    cloud_name: CLOUDE_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_API_SECRET
});

const PORT=process.env.PORT || 5002;

app.use("/api/upload",cloudinaryRouter)

app.listen(PORT,()=>{
    console.log(`Utils server is running on port ${PORT}`);
})

export default app;