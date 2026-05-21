import express from 'express'
import { isAuth } from '../middlewares/isAuth.js'
import { addToCart, fetchMyCart, removeFromCart } from '../controllers/cart.js'

const cartRouter=express.Router()

cartRouter.post("/add",isAuth,addToCart)
cartRouter.post("/remove",isAuth,removeFromCart)
cartRouter.get("/my",isAuth,fetchMyCart)

export default cartRouter