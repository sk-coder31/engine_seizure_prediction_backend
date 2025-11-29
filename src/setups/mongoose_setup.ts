import mongoose from "mongoose";

mongoose.set("strictQuery", true);

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/garage-app");
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};
