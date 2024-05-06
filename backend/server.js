import express from "express";
import cors from "cors";
import mongoose from "./config/connection.js";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello, your server is running and connected to MongoDB!");
});
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
