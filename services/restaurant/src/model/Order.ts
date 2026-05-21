import mongoose, {Schema, Document} from "mongoose";

export interface IOrder extends Document{
    userId:string,
    restaurantId:string,
    restaurantName:string,
    riderId?:string|null,
    riderPhone?:number|null,
    riderName:string|null,
    cartItems:{
        itemId:string,
        name:string,
        price:number,
        quantity:number
    }[],
    addressId:string,
    deliveryAddress:{
        formattedAddress:string,
        mobile:number,
        latitude:number,
        longitude:number
    },
    riderAmount:number,
    distance:number,
    subTotal:number,
    deliveryFee:number,
    grandTotal:number,
    status:"placed"|"accepted"|"preparing"|"ready_for_rider"|"rider_assigned"|"picked_up"|"delivered"|"cancelled",
    paymentStatus:"pending"|"paid"|"failed",
    createdAt:Date,
    updatedAt:Date,
    expiresAt:Date,
}


const orderSchema=new Schema<IOrder>({
    
    userId:{
        type: String,
        required: true,
    },
    restaurantId:{
        type: String,
        required: true,
    },
    restaurantName:{
        type: String,
        required: true,
    },
    riderId:{
        type: String,
        default: null,
    },
    riderPhone:{
        type: Number,
        default: null,
    },
    riderName:{
        type: String,
        default: null,
    },
    riderAmount:{
        type: Number,
        default: 0,
        required: true,
    }  ,
    distance:{
        type: Number,
        default: 0,
        required: true,
    },
    subTotal:{
        type: Number,
        default: 0,
        required: true,
    },
    deliveryFee:{
        type: Number,
        default: 0,
        required: true,
    },
    grandTotal:{
        type: Number,
        default: 0,
        required: true,
    },
    cartItems:[
        {
            itemId:{
                type: String,
                required: true,
            },
            name:{
                type: String,
                required: true,
            },
            price:{
                type: Number,
                required: true,
            },
            quantity:{
                type: Number,
                required: true,
            }
        }
    ],
    addressId:{
        type: String,
        required: true,
    },
    deliveryAddress:{
        formattedAddress:{
            type: String,
            required: true,
        },
        mobile:{
            type: Number,
            required: true,
        },
        latitude:{

            type: Number,
            required: true,
        },
        longitude:{
            type: Number,
            required: true,
        }
    },
    status:{
        type: String,
        enum: ["placed","accepted","preparing","ready_for_rider","rider_assigned","picked_up","delivered","cancelled"],
        default: "placed",
    },
    paymentStatus:{
        type: String,
        enum: ["pending","paid","failed"],
        default: "pending",
    },
    expiresAt:{
        type: Date,
        index:{expireAfterSeconds:0}
    }
},{
    timestamps:true
})

const Order=mongoose.model<IOrder>('Order',orderSchema)

export default Order