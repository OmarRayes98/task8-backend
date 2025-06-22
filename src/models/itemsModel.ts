import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    price: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export type TItem = Document &
  mongoose.InferSchemaType<typeof ItemSchema> & {
    _id: mongoose.Types.ObjectId;
  };

export const Item = mongoose.model<TItem>("Item", ItemSchema);

export default mongoose.model("Item", ItemSchema);
