import { sendResponse } from "@/utils/sendResponse";
import { Item } from "./../models/itemsModel";
import { NextFunction, Request, Response } from "express";
import { addItemSchema, editItemSchema } from "@/validations/itemsValidation";
import path from "path";
import {
  cloudinaryRemoveImage,
  cloudinaryUploadImage,
} from "@/utils/cloudniary";
import fs from "fs";

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
      const imagePath = path.join(
        process.cwd(),
        "public",
        "upload",
        "images",
        "items",
        image ?? ""
      );
      console.log(imagePath, "imagePath");
      if (image) {
        req.body = {
          ...req.body,
          image: {
            url: imagePath,
            publicId: null,
          },
        };
      }

      const data = await addItemSchema.parseAsync(req.body);

      const result: any = await cloudinaryUploadImage(imagePath);
      // console.log(result, "result");

      // 6. Change the profilePhoto field in the DB
      data.image = {
        url: result.secure_url,
        publicId: result.public_id,
      };

      const product = await Item.create({
        name: req.body.name,
        price: req.body.price,
        // Handle image upload
        image: data.image,
      });

      fs.unlinkSync(imagePath);
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

      //delete image from cloudinary service
      if (findProduct.image?.publicId !== null) {
        await cloudinaryRemoveImage(findProduct.image?.publicId);
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

      product.name = req.body.name ?? product.name;
      product.price = req.body.price ?? product.price;
      if (req.file) {
        const image = req.file?.filename;
        const imagePath = path.join(
          __dirname,
          `../../public/upload/images/items/${image}`
        );

        //delete old image from cloudinary
        if (product.image?.publicId !== null) {
          await cloudinaryRemoveImage(product.image?.publicId);
          fs.unlinkSync(imagePath);
        }

        const result: any = await cloudinaryUploadImage(imagePath);
        console.log(result, "result");

        // 6. Change the image field in the DB
        product.image = {
          url: result.secure_url,
          publicId: result.public_id,
        };
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
