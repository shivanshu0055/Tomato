import mongoose,{Schema,Document} from 'mongoose'

export interface IRestaurant extends Document{
    name: string,
    description?: string,
    image: string,
    isVerified: boolean,
    phone: string,
    ownerId: mongoose.Types.ObjectId

    autoLocation: { 
        type: "Point",
        coordinates: [number, number]
        formattedAddress:string
    }
    
    isOpen:boolean
    createdAt: Date,
}

const restaurantSchema:Schema<IRestaurant>= new Schema({
    name: {type: String, required: true,trim: true},
    description: {type: String},
    image: {type: String, required: true},
    isVerified: {type: Boolean, default: false},
    phone: {type: String, required: true},
    ownerId: {type: mongoose.Types.ObjectId, ref: 'User', required: true},

    autoLocation: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], 
            required: true
        },
        formattedAddress: {type: String, required: true}
    },

    isOpen: {type: Boolean, default: false},
},{
    timestamps: true
})

restaurantSchema.index({ autoLocation: '2dsphere' });

export const Restaurant = mongoose.model<IRestaurant>('Restaurant', restaurantSchema)