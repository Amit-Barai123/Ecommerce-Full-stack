import userModels from "../models/userModels.js";
import jwt from "jsonwebtoken";

export const requiredSignIn=async(req,res,next)=>{
 try {
    const token=req.headers.authorization;
    const decode= jwt.verify(token,process.env.JWT_SECERET);
    req.user=decode;
    next();
 } catch (error) {
    console.log(error);
 }
}

//Admin access
export const isAdmin =async(req,res,next)=>{
    try {
      const user= await userModels.findById(req.user._id);
      if(user.role !==1){
        return res.status(401).send({
          success:false,
          message:"unAuthorized"
        })
      } else {
        next();
      }
    } catch (error) {
      console.log(error)
    }
  };