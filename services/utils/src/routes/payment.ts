import express from 'express';
import { Router } from 'express';
import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/payment.js';
import { isAuth } from '../middleware/isAuth.js';

const paymentRouter=Router();

paymentRouter.post("/create",isAuth,createRazorpayOrder)
paymentRouter.post("/verify",isAuth,verifyRazorpayPayment)

export default paymentRouter;