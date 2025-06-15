import express from "express";
import * as authController from "@/controllers/authController";
import upload from "@/middleware/registerPhotoUpload";

const authRouter = express.Router();
authRouter.post("/register",upload.single('profile_image'), authController.register);
authRouter.post("/login", authController.login);

authRouter.post("/logout", authController.logout);


export default authRouter;
