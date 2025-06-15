import { Request, Response, NextFunction } from "express";
import { createToken } from "../lib/jwt";

import { User } from "../models/userModel";
import mongoose from "mongoose";
import { sendResponse } from "@/utils/sendResponse";
import { validateSchemas } from "@/validations/userValidation";

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
    if (profile_image) {
      req.body = {
        ...req.body,
        profile_image: `/public/upload/images/register/${profile_image}`,
      };
    } else {
      req.body = { ...req.body, profile_image: "" };
    }

    const data = await validateSchemas.signup.parseAsync(req.body);

    const user = await User.create({ ...data });

    await user.save();

    // const token = createToken({
    //   id: user._id,
    //   email: user.email,
    // });

    sendResponse(res, 200, {
      status: "success",
      data: {
        user: await user.toFrontend(),
        // token,
      },
    });
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
