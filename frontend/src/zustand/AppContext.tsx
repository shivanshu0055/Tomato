import axios from "axios";
import {create} from "zustand";
import { AUTH_BACKEND_URL, RESTAURANT_BACKEND_URL } from "../main";
import type { AppStoreType } from "../types";

const resolveCity = (address: any) => address?.city || address?.town || address?.village || "Current Location"

export const useAppContext=create<AppStoreType>((set)=>({
    user:null,
    token:null,
    isAuth:false,
    loading:true,
    location:null,
    isLoadingLocation:false,
    city:"Fetching Location...",
    cart:null,
    quantity:null,
    subTotal:null,

    fetchUser:async (token:string)=>{
        set({loading:true})
        try{
            const res=await axios.get(`${AUTH_BACKEND_URL}/api/auth/me`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            set({user:res.data?.user ?? res.data,token,isAuth:true})
        }
        catch(err){
            console.log(err);
            set({
                user:null,
                token:null,
                isAuth:false
            })
        }
        finally{
            set({loading:false})
        }
    },

    fetchLocation:async ()=>{
        set({ isLoadingLocation: true })

        if (typeof navigator === "undefined" || !navigator.geolocation) {
            set({ isLoadingLocation: false })
            return
        }

        navigator.geolocation.getCurrentPosition(async (position)=>{
            const { latitude, longitude } = position.coords

            try{
                const res=await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=en`)
                const data=await res.json()

                set({
                    location: {
                        latitude,
                        longitude,
                        formattedAddress: data.display_name || "Current Location"
                    },
                    city: resolveCity(data.address),
                    isLoadingLocation: false,
                })
            }
            catch(err){
                console.log(err);
                set({
                    location: {
                        latitude,
                        longitude,
                        formattedAddress: "Current Location"
                    },
                    city: "Current Location",
                    isLoadingLocation: false,
                })
            }
        },(err)=>{
            console.log(err);
            set({ isLoadingLocation: false })
        })
    },

    fetchCart: async () => {
        
        const token = localStorage.getItem('token')
        if (!token) {
            set({ cart: null })
            return
        }
        try {
            const res = await axios.get(`${RESTAURANT_BACKEND_URL}/api/cart/my`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            set({ cart: res.data.cart, quantity: res.data.quantity, subTotal: res.data.subTotal })
        }
        catch (err) {
            console.log(err)
            set({ cart: null, quantity: null, subTotal: null })
        }
    },

    clearUser:()=>{
        set({
            user: null,
            token: null,
            isAuth: false,
            loading: false,
            cart: null,
            quantity: null,
            subTotal: null,
        })
    }

}))