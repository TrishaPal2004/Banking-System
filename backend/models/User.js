import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: String,
  password: String, // Will be hashed
  balance: { type: Number, default: 0 },
  address: { type: String, default: "Default" },
  statements: {
    monthly: { type: Array, default: [] },
    annual: { type: Array, default: [] }
  },
  transactions: Array
});

const User = mongoose.model("User", UserSchema);

export default User;
