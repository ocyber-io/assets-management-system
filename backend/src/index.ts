import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"; // Import path for resolving paths
import userRoutes from "./routes/userRoutes";
import fileRoutes from "./routes/fileRoutes";
import folderRoutes from "./routes/folderRoutes";

dotenv.config();

const mongoURI: string = process.env.MONGO_URL as string;

if (!mongoURI) {
  throw new Error("MONGO_URL must be defined");
}

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connection established successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Express application setup
const app: Express = express();
const PORT: string | number = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "frontend", "public", "uploads"))
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, your server is running and connected to MongoDB!");
});

app.use("/api/users", userRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/folders", folderRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
