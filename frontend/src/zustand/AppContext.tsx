import axios from "axios";
import {create} from "zustand";
import { BACKEND_URL } from "../main";
import type { AppStoreType } from "../types";


export const useAppContext=create<AppStoreType>((set)=>({
    user:null,
    token:null,
    isAuth:false,
    loading:false,
    location:null,
    isLoadingLocation:false,
    city:"Fetching Location...",

    fetchUser:async (token:string)=>{
        set({loading:true})
        try{
            const res=await axios.get(`${BACKEND_URL}/api/auth/me`,{
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

    clearUser:()=>{
        set({
            user: null,
            token: null,
            isAuth: false,
            location: null,
            city: "Fetching Location...",
            loading: false,
            isLoadingLocation: false,
        })
    }

}))