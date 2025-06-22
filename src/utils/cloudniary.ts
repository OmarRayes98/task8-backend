import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

export const cloudinaryUploadImage = async (fileToUpload:any) => {
  try {
    const data = await cloudinary.uploader
      .upload(fileToUpload)

      return data;
      
  } catch (error) {
      return error
  }
};


export const cloudinaryRemoveImage = async (imagePublicId:any) => {
  try {
    const data = await cloudinary.uploader
      .destroy(imagePublicId)

      return data;
      
  } catch (error) {
      return error;
  }
};
