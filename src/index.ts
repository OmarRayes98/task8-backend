import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { Server } from "http";
import connectDB from "./config/dbConnect";



process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION!");
    if (err instanceof Error) {
      console.log(err.message);
      console.log(err.stack);
    } else {
      console.log(err);
    }
    console.log("Shutting down...");
  
    if (myServer) {
      myServer.close(() => {
        process.exit(1);
      });
    }
  });
  const PORT = process.env.PORT;

let myServer : Server | undefined;

connectDB();

myServer = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

    process.on("unhandledRejection", (err) => {
      console.log("UNHANDLED REJECTION!");
      if (err instanceof Error) {
        console.log(err.message);
        console.log(err.stack);
      } else {
        console.log(err);
      }
      console.log("Shutting down...");
    
      if (myServer) {
        myServer.close(() => {
          process.exit(1);
        });
      }
    });