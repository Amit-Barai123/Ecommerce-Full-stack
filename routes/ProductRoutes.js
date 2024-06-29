import express from 'express'
import { isAdmin, requiredSignIn } from '../middleware/authmiddleware.js';
import { ProductCategoryController, brainTreePaymentController, braintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProduct, productCountController, productFilterController, productListController, productPhotoController, searchProductController, similarProductController, updateProductController } from '../controllers/productController.js';
import formidable from 'express-formidable';

const router =express.Router();

// product filter 
router.post('/filter',productFilterController);

// create product
router.post("/create-product",requiredSignIn,isAdmin,formidable(),createProductController)

// get all products

router.get('/get-product',getProductController)

// single product

router.get('/get-products/:slug',getSingleProduct);

//getphoto

router.get('/product-photo/:pid',productPhotoController);

// delete product 

router.delete('/delete-product/:pid',requiredSignIn,isAdmin,deleteProductController);

//update products

router.put('/update-product/:pid',requiredSignIn,isAdmin,formidable(),updateProductController);

//product count

router.get('/product-count',productCountController);

//product per page 

router.get('/list/:page',productListController);

// search product

router.get('/search/:keyword',searchProductController);

//similar product

router.get('/related-product/:pid/:cid',similarProductController)

// get by category

router.get('/product-category/:slug',ProductCategoryController);
//payment route token

router.get('/barintree/token',braintreeTokenController)

//PAYMENTS

router.post('/braintree/payment',requiredSignIn,brainTreePaymentController)

export default router;