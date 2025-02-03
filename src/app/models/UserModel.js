import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenSecret: String,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

// Use singular model name "User" for clarity.
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
