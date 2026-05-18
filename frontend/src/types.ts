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


