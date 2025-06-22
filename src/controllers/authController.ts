import { Request, Response, NextFunction } from "express";
import { createToken } from "../lib/jwt";

import { User } from "../models/userModel";
import mongoose from "mongoose";
import { sendResponse } from "@/utils/sendResponse";
import { validateSchemas } from "@/validations/userValidation";
import path from "path";
import {
  cloudinaryRemoveImage,
  cloudinaryUploadImage,
} from "@/utils/cloudniary";
import fs from "fs";

/*
1- create user
2- send verification
3- send info of user + token
So after register have to to verfiy to be the user?.isAccountVerified=true

*/
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const profile_image = req.file?.filename;
    
    const imagePath = path.join(
      process.cwd(),
      "public",
      "upload",
      "images",
      "register",
      profile_image??""
    );
    console.log(imagePath, "imagePath");

    if (profile_image) {
      req.body = {
        ...req.body,
        profile_image: {
          url: imagePath,
          publicId: null,
        },
      };
    }

    const data = await validateSchemas.signup.parseAsync(req.body);

    //get path image

    console.log(imagePath, "imagePath");
    //upload to cloudinary
    const result: any = await cloudinaryUploadImage(imagePath);
    console.log(result, "result");

    // 6. Change the profilePhoto field in the DB
    data.profile_image = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    const user = await User.create({ ...data });

    const token = createToken({
      id: user._id,
      email: user.email,
    });

    sendResponse(res, 200, {
      status: "success",
      data: {
        user: await user.toFrontend(),
        token,
      },
    });

    fs.unlinkSync(imagePath);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await validateSchemas.login.parseAsync(req.body);

    const user = await User.findOne({
      email: data.email,
    });

    if (!user) {
      return sendResponse(res, 404, {
        status: "fail",
        message: `User doesn't exists`,
      });
    }
    const userId = user._id as mongoose.Types.ObjectId;

    const isAuth = await user.comparePassword(data.password);
    if (!isAuth) {
      return sendResponse(res, 401, {
        status: "fail",
        message: `invalid credential`,
      });
    }

    const token = createToken({
      id: user._id,
      email: user.email,
    });

    sendResponse(res, 200, {
      status: "success",
      data: {
        user: await user.toFrontend(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return sendResponse(res, 200, {
      status: "success",
      data: "Logged out successfully. Please remove the token on the client.",
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();

    sendResponse(res, 200, {
      status: "success",
      data: {
        users,
      },
    });
  } catch (err) {
    next(err);
  }
};
