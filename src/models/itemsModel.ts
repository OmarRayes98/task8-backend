import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
  },
  { timestamps: false }
);

export type TItem = mongoose.InferSchemaType<typeof ItemSchema> & {
    _id : mongoose.Types.ObjectId;
};

export default mongoose.model("Item", ItemSchema);
