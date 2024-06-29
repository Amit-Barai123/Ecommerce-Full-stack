import express from 'express';
import { isAdmin, requiredSignIn } from '../middleware/authmiddleware.js';
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from '../controllers/categoryController.js';

const rout= express.Router();
//create category
rout.post('/createCategory',requiredSignIn,isAdmin,createCategoryController);

//update category

rout.put('/updatCategory/:id',requiredSignIn,isAdmin,updateCategoryController);

//get categories all

rout.get('/Categories',categoryController);
// single category

rout.get('/single-category/:slug',singleCategoryController);

//delete category 

rout.delete('/delete-category/:id',requiredSignIn,isAdmin,deleteCategoryController);

export default rout;