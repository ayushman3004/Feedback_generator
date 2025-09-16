import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: boolean;
};


const connection : ConnectionObject = {}

async function dbConnect() : Promise<void>{
    if(connection.isConnected){
        console.log("Already connected to database");
        
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "" , {})
        connection.isConnected = db.connections[0].readyState === 1
        
    } catch (error) {
        console.log("Database connection failed" , error);
        
        process.exit(1);
    }
}


export default dbConnect;  