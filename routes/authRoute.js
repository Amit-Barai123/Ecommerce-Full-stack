import express from 'express';
import {OrderStatusController, RegisterController,forgotPasswordController,getAllOrdersController,getOrdersController,loginController, testController, updateProfileController,} from '../controllers/authController.js';
import { isAdmin, requiredSignIn } from '../middleware/authmiddleware.js';
//router object
const router=express.Router()
//router 
//register || Method post
router.post('/register',RegisterController);

//Login || POST
router.post("/login",loginController);

router.get("/test",requiredSignIn,isAdmin,testController);

router.get("/user-auth",requiredSignIn,(req,res)=>{
    res.status(200).send({ok:true});
});

// forgot password 
router.post('/forget',forgotPasswordController);

//protected route for admin

router.get("/admin-auth",requiredSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
});


//update profile

router.put('/profile',requiredSignIn,updateProfileController);

// order

router.get('/orders',requiredSignIn,getOrdersController);

// all orders

router.get('/Allorders',requiredSignIn,isAdmin,getAllOrdersController);

// order update

router.put('/order-status/:orderId',requiredSignIn,isAdmin,OrderStatusController);


export default router

