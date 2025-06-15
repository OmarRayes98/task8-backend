import express from "express";
import upload from "../middleware/itemssPhotoUpload";
import { authMiddleware } from "../middleware/authMiddleware";
import ProductController from "@/controllers/itemController";
const itemsRouter = express.Router();

itemsRouter
  .route("/")
  .get(
    ProductController.getProducts
  )
  .post(
    authMiddleware,
    upload.single("image"),
    ProductController.addProduct 
  );

itemsRouter
  .route("/:id")
  .get(
    ProductController.getProduct
  )
  .delete(authMiddleware, ProductController.deleteProducts)
  .put(
    authMiddleware,
    upload.single("image"),
    ProductController.editProduct
  );


export default itemsRouter;
