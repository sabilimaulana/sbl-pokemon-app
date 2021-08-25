import { User } from "@server/types/user";
import mongoose, { model, Schema } from "mongoose";

const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models["User"] || model<User>("User", userSchema);
