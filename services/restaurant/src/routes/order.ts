import express from 'express'
import { Router } from 'express'
import { createOrder, fetchOrderForPayment, fetchRestaurantOrders, fetchSingleOrder, getMyOrders, updateOrderStatus } from '../controllers/order.js'
import { isAuth, isSeller } from '../middlewares/isAuth.js'

const orderRouter=Router()

orderRouter.post('/create', isAuth, createOrder)
orderRouter.get('/payment/:orderId',isAuth,fetchOrderForPayment)
orderRouter.get('/:restaurantId',isAuth,isSeller,fetchRestaurantOrders)
orderRouter.put('/:orderId',isAuth,isSeller,updateOrderStatus)
orderRouter.get("/my",isAuth,getMyOrders)
orderRouter.get("/my/:orderId",isAuth,fetchSingleOrder)

export default orderRouter