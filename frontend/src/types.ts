export interface UserType{
    _id:string,
    name: string,
    email: string,
    image: string
    role: string,
}

export interface LocationDataType{
    latitude:number,
    longitude:number,
    formattedAddress:string
}

export interface AppStoreType {
    user:UserType | null,
    token:string | null,
    isAuth:boolean,
    loading:boolean,
    location:LocationDataType | null,
    isLoadingLocation:boolean,
    city:string,

    fetchUser:(token:string)=>Promise<void>,
    clearUser:()=>void
}


export interface IRestaurant{
    _id:string,
    name: string,
    description?: string,
    image: string,
    isVerified: boolean,
    phone: string,
    ownerId: string

    autoLocation: { 
        type: "Point",
        coordinates: [number, number]
        formattedAddress:string
    }
    
    isOpen:boolean
    createdAt: Date,
}

export interface IMenuItem {
    _id: string,
    restaurantId: string,
    name: string,
    description: string,
    image?: string,
    price: number,
    isAvailable: boolean,
    createdAt: Date,
    updatedAt: Date,
}

export interface RestaurantLayoutContext {
    restaurant: IRestaurant | null,
    refreshRestaurant: () => Promise<void>,
}

