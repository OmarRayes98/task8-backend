import z from "zod";

export const validateSchemas = {
  create: z.object({
    name: z.string({ required_error: "name is required" }),
    price: z.preprocess(
      (value) => Number(value),
      z
        .number({
          message: "Price must be a valid number",
        })
        .gt(0, {
          message: "Price must be greater than 0",
        })
    ),
    image: z
      .string({ required_error: "image is required" })
      .min(1, "image cannot be empty"),
  }),
};
