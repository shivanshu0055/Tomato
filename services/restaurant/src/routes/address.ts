import express from 'express'
import { isAuth } from '../middlewares/isAuth.js'
import { addAddress, deleteAddress, fetchMyAddresses, updateAddress } from '../controllers/address.js'
import e, {Router} from 'express'

const addressRouter=Router()

addressRouter.post("/add",isAuth,addAddress)
addressRouter.delete("/:id",isAuth,deleteAddress)
addressRouter.get("/my",isAuth,fetchMyAddresses)
addressRouter.put("/edit/:id",isAuth,updateAddress)

export default addressRouter