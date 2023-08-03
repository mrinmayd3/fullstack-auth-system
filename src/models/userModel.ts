import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: [true, "Username is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    require: [true, "Email is required"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    require: [true, "Password is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
