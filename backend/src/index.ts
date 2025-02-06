import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();
const app = express();

app.use(express.json());

const PORT = process.env.PORT || "";
const ORIGIN = process.env.ORIGIN || "";
const MONGODB_URI = process.env.MONGODB_URI || "";

app.use(
  cors({
    origin: ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

mongoose
  .connect(MONGODB_URI, {
    autoIndex: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err: unknown) => console.error(err));

export default app;
