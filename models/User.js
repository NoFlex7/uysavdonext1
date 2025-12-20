import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["admin", "moderator"],
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
