import express from 'express'
import { Router } from 'express'
import { createOrder, fetchOrderForPayment } from '../controllers/order.js'
import { isAuth } from '../middlewares/isAuth.js'

const orderRouter=Router()

orderRouter.post('/create', isAuth, createOrder)
orderRouter.get('/payment/:orderId',isAuth,fetchOrderForPayment)

export default orderRouter