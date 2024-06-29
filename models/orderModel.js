import mongoose from "mongoose";

const OrderSchema =new mongoose.Schema({
  products : [{
    type:mongoose.ObjectId,
    ref : 'Products'
  }],
  payment:{},
  buyer : {
        type :mongoose.ObjectId,
        ref :"Users"
    }
,
  Status :{
    type : String,
    default: "not process",
    enum:["not process","processing","shipped","delivered","cancel"]
  },

},{timestamps:true});
export default  mongoose.model("order",OrderSchema);