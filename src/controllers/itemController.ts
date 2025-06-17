import { sendResponse } from "@/utils/sendResponse";
import {Item} from "./../models/itemsModel";
import { NextFunction, Request, Response } from "express";
import { addItemSchema, editItemSchema } from "@/validations/itemsValidation";

const ProductController = {
  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await Item.find();

      sendResponse(res, 200, {
        status: "success",
        data: {
          products,
        },
      });
    } catch (err) {
      next(err);
    }
  },
  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      const product = await Item.findById(id);

      if (!product) {
        sendResponse(res, 404, {
          status: "fail",
          message: "Product not found",
        });
        return;
      }
      sendResponse(res, 200, {
        status: "success",
        data: {
          product,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async addProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const image = req.file?.filename;

      if (image) {
        req.body = {
          ...req.body,
          image: `/public/upload/images/items/${image}`,
        };
      } else {
        req.body = { ...req.body, image: "" };
      }

      await addItemSchema.parseAsync(req.body);

      const product = await Item.create({
        name: req.body.name,
        price: req.body.price,
        // Handle image upload
        image: req.body.image,
      });

      res.status(201).json({
        status: "success",
        data: {
          product,
        },
      });
    } catch (err) {
      next(err);
    }
  },
  async deleteProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      const findProduct = await Item.findById(id);
      if (!findProduct) {
        sendResponse(res, 404, {
          status: "fail",
          message: "Product not found",
        });
        return;
      }
      await Item.findByIdAndDelete(id);
      sendResponse(res, 200, {
        status: "success",
        data: "delete is done",
      });
    } catch (err) {
      next(err);
    }
  },

  async editProduct(req: Request, res: Response, next: NextFunction) {
    try {
      await editItemSchema.parseAsync(req.body);
      const id = req.params.id;

      const product = await Item.findById(id);
      if (!product) {
        sendResponse(res, 404, {
          status: "fail",
          message: "Product not found",
        });
        return;
      }

      product.name = req.body.title ?? product.name;
      product.price = req.body.price ?? product.price;
      if (req.file) {
        product.image = `/upload/images/items/${req.file.filename}`;
      }

      const updatedProduct = await product.save();
      res.status(200).json({
        status: "success",
        data: {
          updatedProduct,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};

export default ProductController;
