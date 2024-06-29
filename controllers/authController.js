import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModels from "../models/userModels.js";
import orderModel from "../models/orderModel.js";
import JWT from 'jsonwebtoken'
export const RegisterController = async (req,res)=>{
try {
    const {name,email,password,phone,adress,ans} =req.body
    //validation 
    if(!name){
        return res.send({message:"name is required"});
    }
    if(!email){
        return res.send({message:"email is required"});
    }
    if(!phone){
        return res.send({message:"mobile number  is required"});
    }
    if(!password){
        return res.send({message:"password  is required"});
    }
    if(!adress){
        return res.send({message:"adress is required"});
    }
    if(!ans){
      return res.send({message:"answer is required"});
  }
    //esisting user 
    const existingUser= await userModels.findOne({email});
    if(existingUser){
        return res.status(200).send({
            success:true,
            message:"already register please Login"
        })
    }
    const hashedPassword=await hashPassword(password);
    //save 
    const user = await new userModels({name,email,phone,adress,password:hashedPassword,ans}).save();
    res.status(200).send({
        success:true,
        message:"user registerd",
        user
    })
} catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:"error in registration",
        error
    })
}
}
//Post Login
export const loginController = async (req, res) => {
    try {
      const { email, password } = req.body;
      //validation
      if (!email || !password) {
        return res.status(404).send({
          success: false,
          message: "Invalid email or password",
        });
      }
      //check user
      const user = await userModels.findOne({ email });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Email is not registerd",
        });
      }
      const match = await comparePassword(password, user.password);
      if (!match) {
        return res.status(200).send({
          success: false,
          message: "Invalid Password",
        });
      }
      //token
      const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECERET, {
        expiresIn: "7d",
      });
      res.status(200).send({
        success: true,
        message: "login successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.adress,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in login",
        error,
      });
    }
  };

export const testController=async(req,res)=>{
  try {
    res.send("this is protected routes");
  } catch (error) {
    console.log(error);
  }
}

//forgot password controller

export const forgotPasswordController=async(req,res)=>{
 try {
  const {email,newPassword,ans}=req.body
  if(!email){
    return res.send({message:"email is required"});
}

if(!newPassword){
    return res.send({message:"Newpassword  is required"});
}
if(!ans){
  return res.send({message:"question is required"});
}
const user= await userModels.findOne({email,ans});
if(!user){
  return res.status(404).send({
    success:false,
    message:"email or answer didnot match",

  });

}
const hashed= await hashPassword(newPassword);
await userModels.findByIdAndUpdate(user._id,{password:hashed});
res.status(200).send({
  success: true,
  message: "Password Reset Successfully",
});
 } catch (error) {
  console.log(error);
  res.status(500).send({
    message:"some things went worng",
    error
  })
 }
}

//update profile

export const updateProfileController= async(req,res)=>{
  try {
    const {name,email,password,address,phone}= req.body
    const user =await userModels.findById(req.user._id);
    
    if (password && password.length <6 ){
      return res.json({error:`password is required and 6 char long`});
    };
    const hashedPas = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModels.findByIdAndUpdate(req.user._id,{name:name || user.name,
      password: hashedPas || user.password,
      phone : phone || user.phone,
      adress : address || user.adress,
      phone : phone || user.phone
  
    },{new:true});
    
    res.status(200).send({
      sucess:true,
      message :'profile updated successfully',
      updatedUser
    })

  } catch (error) {
    console.log(error);
    res.status(500).send({
      message:"Error while updating profile",
      error
    })
  }
}

// orders

export const getOrdersController = async (req,res) => {
  try {
    const orders = await orderModel
      .find({buyer: req.user._id})
      .populate("products", "-photo")
      .populate("buyer", "name");
      console.log(`hi the rew.user._id is ${req.user._id}`)
    res.send(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

// all order

export const getAllOrdersController = async (req,res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("products", "-photo")
      .populate("buyer", "name").sort({createdAt:-1});

    res.send(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

// order status controler

export const OrderStatusController = async (req,res) =>{
  try {
    const { orderId } =req.params
    const { Status } =req.body
    const order = await orderModel.findByIdAndUpdate(orderId,{Status},{new:true});
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile update Orders",
      error,
    })
  }
}