import express  from 'express';
import { auth } from 'googleapis/build/src/apis/abusiveexperiencereport/index.js';
import { addUserRole, loginUser, myProfile } from '../controllers/auth.js';
import { isAuth } from '../middlewares/isAuth.js';

const authRouter=express.Router()

authRouter.post("/login",loginUser)
authRouter.put("/add/role",isAuth,addUserRole)
authRouter.get("/me",isAuth,myProfile)

export default authRouter
