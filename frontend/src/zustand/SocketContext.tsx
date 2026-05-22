import {io, Socket} from "socket.io-client"
import { create } from "zustand"
import { REALTIME_BACKEND_URL } from "../main"

interface SocketContextType {
    socket:Socket|null,
    connectSocket:(token:string)=>void,
    disconnectSocket:()=>void
}

export const useSocketContext=create<SocketContextType>((set,get)=>({
    socket:null,

    connectSocket:(token:string)=>{

        const existingSocket=get().socket

        if(existingSocket){
            return
        }

        const newSocket=io(REALTIME_BACKEND_URL as string,{
            auth:{token}
        })

        newSocket.on("connect",()=>{
            console.log("Connected to socket server")
        }
        )

        newSocket.on("disconnect",()=>{
            console.log("Disconnected from socket server")
        })

        newSocket.on("connect_error",(err)=>{
            console.error("Socket error:", err)
        })

        set({socket:newSocket})
    },

    disconnectSocket:()=>{
        const existingSocket=get().socket
        if(existingSocket){
            existingSocket.disconnect()
            set({socket:null})
        }
    }
}))

