import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db.js"; // Add .js extension explicitly
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api",authRoutes)
app.use("/api/auth",userRoutes)

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
