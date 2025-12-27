import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json()); // for parsing JSON
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
// basic protected test route (optional)
import authMiddleware from "./middleware/authMiddleware.js";
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You accessed a protected route', user: req.user });
});

// connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
