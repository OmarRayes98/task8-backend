import CryptoJS from "crypto-js";
import mongoose, { Document, InferSchemaType, model } from "mongoose";
const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      trim: true,
      required: true,
    },
    last_name: {
      type: String,
      trim: true,
      required: true,
    },
    user_name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      // select: false,
    },
    profile_image: {
      type: Object,
      default: {
        url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png",
        publicId: null,
      },
    },
  },
  { timestamps: true }
);

type UserType = Document & InferSchemaType<typeof userSchema>;

export type { UserType };
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = CryptoJS.AES.encrypt(
      this.password,
      process.env.JWT_SECRET!
    ).toString();
    // this.password = await bcryptjs.hash(this.password, 8);
  }
  next();
});

async function comparePassword(this: UserType, enteredPassword: string) {
  const existedPassword = CryptoJS.AES.decrypt(
    this.password.toString(),
    process.env.JWT_SECRET!
  ).toString(CryptoJS.enc.Utf8);

  return existedPassword === enteredPassword;
}

userSchema.methods.comparePassword = comparePassword;

async function toFrontend(this: UserType) {
  this.password = "";
  return this;
}

userSchema.methods.toFrontend = toFrontend;
export const User = model<
  UserType & {
    comparePassword: typeof comparePassword;
    toFrontend: typeof toFrontend;
  }
>("User", userSchema);

export default mongoose.model<
  UserType & {
    comparePassword: typeof comparePassword;
    toFrontend: typeof toFrontend;
  }
>("User", userSchema);
