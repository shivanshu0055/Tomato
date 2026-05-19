import express from 'express';
import { isAuth, isSeller } from '../middlewares/isAuth.js';
import { addRestaurant, fetchMyRestaurant, editRestaurant, toggleIsOpen } from '../controllers/restaurant.js';
import uploadFile from '../middlewares/multer.js';
;

const restaurantRouter=express.Router();

restaurantRouter.post("/add",isAuth,isSeller,uploadFile,addRestaurant)
restaurantRouter.get("/my",isAuth,isSeller,fetchMyRestaurant)
restaurantRouter.put("/update",isAuth,isSeller,uploadFile,editRestaurant)
restaurantRouter.patch("/toggleIsOpen",isAuth,isSeller,toggleIsOpen)

export default restaurantRouter;