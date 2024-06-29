import mongoose from "mongoose";
const userSchema= new mongoose.Schema({
name:{
    type:String,
    required:true,
    trim:true
},
email:{
    type:String,
    required:true,
    trim:true
},
password:{
    type:String,
    required:true,
    trim:false
},
phone:{
    type:Number,
    required:true,
},
adress:{
    type:String,
    required:true,
    trim:true
},
role:{
    type: Number,
    default:0,
},
ans:{
    type:String,
    required:true,
}
},{timestamps:true})
export default mongoose.model('Users',userSchema);