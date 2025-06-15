import express from "express";
import upload from "../middleware/itemssPhotoUpload";
import productController from "../controllers/productController";
import { adminAuthMiddleware } from "@/middleware/adminAuthMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";
import filterMiddleware from "@/middleware/filterMiddleware";
const router = express.Router();

router
  .route("/items")
  .get(
    // authMiddleware,
    filterMiddleware,
    productController.getProducts
  )
  .post(
    adminAuthMiddleware,
    upload.single("image"),
    productController.addProduct
  );

router
  .route("/items/:id")
  .get(
    // authMiddleware,
    productController.getProduct
  )
  .delete(adminAuthMiddleware, productController.deleteProducts)
  .put(
    adminAuthMiddleware,
    upload.single("image"),
    productController.editProduct
  );

router.route("/:id/relate").get(productController.getRelatedProducts);

export default router;
