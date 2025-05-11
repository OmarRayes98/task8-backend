import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt";
import { User } from "../models/userModel";
import { sendResponse } from "@/utils/sendResponse";

export const authMiddleware = async (
  req: Request & {
    user?: unknown;
  },
  res: Response,
  next: NextFunction
) => {
  try{
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return sendResponse(res, 401, {
      status: "fail",
      message: `No token, authorization denied`,
    });
  }

  if (token) {
      const decoded = verifyToken(token) as { id: string };


      console.log("token is: ", token);
      console.log("decoded token is: ", decoded);
      
      const user = await User.findById(decoded.id);

      if (!user) {
        return sendResponse(res, 404, {
          status: "fail",
          message: `User not found`,
        });
      }

      req.user = user;
      next();
  }
} catch(err:any) {
  console.log(err);
  
  if (err.name === 'TokenExpiredError') {
      return sendResponse(res, 403, {
        status: 'fail',
        message: 'Forbidden, access token has expired',
      });
    }

  return sendResponse(res, 401, {
    status: "fail",
    message: `Invalid token`,
  });
}

};
