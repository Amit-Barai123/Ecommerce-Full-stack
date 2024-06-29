import express from "express"
import dotenv from 'dotenv'
import ConectDb from "./config/db.js";
import morgan from "morgan";
import authRoute  from './routes/authRoute.js';
import catRoutes from './routes/catRoutes.js'
import ProductRoutes from './routes/ProductRoutes.js'
import cors from 'cors'
import {fileURLToPath} from 'url'
 import path from 'path';
// configure env 
dotenv.config();
//database config
ConectDb();
//esmodule fixed
const __filename = fileURLToPath(import.meta.url);
const __dirname= path.dirname(__filename);
const app=express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(express.static(path.join(__dirname, './client/build')))
app.use("/api/v1/auth", authRoute);
//category routes
app.use('/api/v1/category',catRoutes);
//product routes
app.use('/api/v1/products',ProductRoutes);
// rest api 
app.use('*',function(req,res){
  res.sendFile(path.join(__dirname,'./client/build/index.html'));
})
//  const ports =process.env.PORT;
 app.listen(5555,()=>{
   console.log(`Server Started on : http://127.0.0.1:5555`);
 });
 
