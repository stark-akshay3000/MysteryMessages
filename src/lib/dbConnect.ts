import { log } from "console"
import mongoose from "mongoose"
import { connect } from "tls"

type ConnectionObject = {
    isConnected?:number
}

const connection : ConnectionObject= {}

async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("Already connected to database");
        return
    }
    try{
      const db =   await mongoose.connect(process.env.MONGODB_URI || '',{})
     connection.isConnected = db.connections[0].readyState
     console.log("Db connected successfully");
     

    }catch(error){
        console.log("db connection failed");
        
       process.exit(1);
    }
}

export default dbConnect