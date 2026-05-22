import express from 'express';
import { isAuth, isSeller } from '../middlewares/isAuth.js';
import { addRestaurant, fetchMyRestaurant, editRestaurant, toggleIsOpen, getNearbyVerifiedRestaurants, fetchSingleRestaurant } from '../controllers/restaurant.js';
import uploadFile from '../middlewares/multer.js';
;

const restaurantRouter=express.Router();

restaurantRouter.post("/add",isAuth,isSeller,uploadFile,addRestaurant)
restaurantRouter.get("/my",isAuth,isSeller,fetchMyRestaurant)
restaurantRouter.put("/update",isAuth,isSeller,uploadFile,editRestaurant)
restaurantRouter.patch("/toggleIsOpen",isAuth,isSeller,toggleIsOpen)
restaurantRouter.get("/all",isAuth,getNearbyVerifiedRestaurants)
restaurantRouter.get("/:id",isAuth,fetchSingleRestaurant)



export default restaurantRouter;