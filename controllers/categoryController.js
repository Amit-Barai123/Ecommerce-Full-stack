import categoryModels from "../models/categoryModels.js";
import slugify from "slugify";
export const createCategoryController=async(req,res)=>{
try {
    const {name}=req.body
    if(!name) {
        return res.status(404).send({
            message:"name is required"
        })
    }
    const existingCategory =await categoryModels.findOne({name});
    if(existingCategory){
        return res.status(200).send({
            success:true,
            message:"category already exits"
        })
    }
    
    const category= await new categoryModels({name,slug:slugify(name)}).save();
    res.status(201).send({
        success:true,
        message:"new category created",
        category
        
    })

} catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message:"error in category",
        error
    })
}
}

//updatecategoty controller

export const updateCategoryController=async(req,res)=>{
    try {
        const {name}=req.body
        const {id}=req.params
        const category =await categoryModels.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});
        res.status(200).send({
            success:true,
            message:"category updated sucessfully",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(404).send({
            success:false,
            error,
            message:"error while updating catergory"
        })
    }
}

//get all category

export const categoryController=async(req,res)=>{
    try {
        const category= await categoryModels.find({});
        res.status(200).send({
            success:true,
            message:"sucessfully all category fetched",
            category
        })
    } catch (error) {
        console.log(error),
        res.status(200).send({
            success:false,
            message:"error in fetching category",
            error
        })
    }
}

export const singleCategoryController=async(req,res)=>{
try {
  
    const singlecategory= await categoryModels.findOne({slug:req.params.slug});
    res.status(200).send({
        success:true,
        message:"single category fetched sucessfully",
        singlecategory
    })
} catch (error) {
    console.log(error),
        res.status(200).send({
            success:false,
            message:"error in fetching single category",
            error
        })
}
}

//delete category

export  const deleteCategoryController =async(req,res)=>{
    try {
        const {id} =req.params
        const deletecategory= await categoryModels.findByIdAndDelete(id);
    res.status(200).send({
        success:true,
        message:"single category fetched sucessfully"
        
    })
    } catch (error) {
        console.log(error),
        res.status(200).send({
            success:false,
            message:"error in deleting category",
            error
        })
    }
}