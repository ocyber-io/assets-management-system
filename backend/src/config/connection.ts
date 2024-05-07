import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI: string = process.env.MONGO_URL as string;
console.log("Connecting to MongoDB at URI:", mongoURI); // To confirm the URI is correct

if (!mongoURI) {
  throw new Error("MONGO_URL must be defined");
}

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connection established successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

export default mongoose;
