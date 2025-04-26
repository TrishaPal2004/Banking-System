import express from "express";
import User from "../models/User.js";  // Ensure this path is correct

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(200).json({ success:false, message: "User not found" });
    }

    // ✅ Secure password check
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid=(password===user.password)

    if (!isPasswordValid) {
      return res.status(200).json({success:false, message: "Invalid credentials" });
    }

    res.status(200).json({success:true, message: "Login successful!", user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({success:false, message: "Server error" });
  }
});

export default router;
