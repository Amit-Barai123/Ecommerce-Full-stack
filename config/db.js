import mongoose from "mongoose";
const ConectDb =async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URL)
        console.log(`database connected to mongodb ${conn.connection.host}`)

    } catch(error){
        console.log(`Error  in mongodb ${error}`)
    }
}
export default ConectDb;