import mongoose from "mongoose";


const connectDB = async () => {
      try {
        await mongoose.connect(process.env.DATABASE as string, {
          serverSelectionTimeoutMS: 5000, // optional timeout for faster failure
        });
        console.log("Connected to MongoDB");
      } catch (error) {
        console.error("MongoDB connection error:", error);
      }
    };
    
    export default connectDB;