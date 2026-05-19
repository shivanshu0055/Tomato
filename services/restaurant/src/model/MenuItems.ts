import mongoose, { Document } from "mongoose";

export interface IMenuItem extends Document{
    restaurantId:mongoose.Types.ObjectId,
    name: string,
    description:string,
    image?:string,
    price:number,
    isAvailable:boolean,
    createdAt:Date,
    updatedAt:Date
}

const menuItemSchema = new mongoose.Schema<IMenuItem>({
    restaurantId:{
        type: mongoose.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true })

const MenuItem=mongoose.model<IMenuItem>('MenuItem', menuItemSchema)

export default MenuItem