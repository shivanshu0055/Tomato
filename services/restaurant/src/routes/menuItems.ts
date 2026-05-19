import express from 'express'
import { addMenuItem, deleteMenuItem, getAllItems, toggleMenuItemAvailability } from '../controllers/menuItems.js'
import { isAuth, isSeller } from '../middlewares/isAuth.js'
import uploadFile from '../middlewares/multer.js'

const menuItemsRouter=express.Router()

menuItemsRouter.post('/new',isAuth,isSeller,uploadFile, addMenuItem)
menuItemsRouter.get('/all/:id',isAuth, getAllItems)
menuItemsRouter.delete('/:id',isAuth,isSeller, deleteMenuItem)
menuItemsRouter.get('/status/:id',isAuth,isSeller, toggleMenuItemAvailability)

export default menuItemsRouter