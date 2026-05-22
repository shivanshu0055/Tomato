import {Server} from "socket.io";
import http from 'http'
import jwt, { JwtPayload } from "jsonwebtoken";

let io:Server

export const initSocket=(server:http.Server)=>{
    io=new Server(server,{
        cors:{
            origin:"*"
        }
    })

    io.use((socket, next) => {
        try{
            const token=socket.handshake.auth?.token
            if (!token) {
                return next(new Error("Authentication error: Token not provided"));
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
            if(!decoded || !decoded.user){
                return next(new Error("Authentication error: Invalid token"));
            }
            socket.data.user = decoded.user;
            next();
        }
        catch(err){
            console.error("Socket authentication error:", err);
            next(new Error("Authentication error: Failed to verify token"));
        }
    })

    io.on("connection",(socket)=>{
        const user=socket.data.user

        if(!user){
            console.error("Socket connection error: User data not found after authentication");
            socket.disconnect();
            return;
        }

        const userId=user._id

        socket.join(`user:${userId}`)

        if(user.restaurantId){
            socket.join(`restaurant:${user.restaurantId}`)
        }

        console.log(`User ${userId} connected to socket`)
        console.log("Socket rooms:", [...socket.rooms])

        socket.on("disconnect",()=>{
            console.log(`User ${userId} disconnected from socket`)
        })

    })
    return io
}

export const getIO=()=>{
    if(!io){
        throw new Error("Socket.io not initialized")
    }
    return io
}