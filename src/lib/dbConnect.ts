import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:number
}
const connection:ConnectionObject={}

async function dbConnect():Promise<void>{

    if(connection.isConnected){
        console.log("already connnected to db");
        return;
    }
    try{
        const db=await mongoose.connect(process.env.MONGODB_URI || '',{})
        connection.isConnected=db.connections[0].readyState

        console.log("DB connenct suceesfully");
    }catch(error){
        console.log("db connect failes",error);
    }
}
export default dbConnect;