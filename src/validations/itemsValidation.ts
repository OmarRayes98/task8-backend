import z from "zod";

const addItemSchema = z.object({
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
  image: z.object({
    url: z.string().url(), 
    publicId: z.string().nullable().default(null),
  }),
});

const editItemSchema = addItemSchema.partial();

export { addItemSchema, editItemSchema };
