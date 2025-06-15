import { sendResponse } from "@/utils/sendResponse";
import { Request, Response, NextFunction } from "express";
import { CastError } from "mongoose";
import multer from "multer";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

const globalErrorHandling = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ZodError) {
    sendResponse(res, 400, {
      status: "fail",
      message: fromZodError(error).toString(),
    });
  } else if (error instanceof multer.MulterError) {
    // This is a Multer-specific error (like file validation failure)
    return sendResponse(res, 400, {
      status: "fail",
      message: error.message, // Send error message from Multer
    });
  }
  // Check for invalid ObjectId values (CastError) thrown by Mongoose
  else if (error.name === "CastError") {
    error = error as CastError;
    const message = `The provided value: ${error.value} is not a valid ObjectId.`;
    sendResponse(res, 400, { status: "fail", message });
  }

  // Check for duplicate key error (code 11000) thrown by MongoDB
  else if (error.code === 11000) {
    const message = `Duplicate field value: ${
      Object.keys(error.keyPattern)[0]
    }. Please use another value.`;
    sendResponse(res, 400, { status: "fail", message });
  } else {
    sendResponse(res, 500, {
      status: "error",
      message: "internal server error",
      error,
    });
  }
};

export default globalErrorHandling;
