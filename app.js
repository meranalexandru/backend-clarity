import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import objectivesRouter from "./routes/objectives.js";
import authRoutes from "./auth/authRoutes.js";
import dailyTaskRouter from "./routes/daily-task.js";
import yearlyVisionRouter from "./routes/year-vision.js";
import weeklyGoalRouter from "./routes/weekly_goal.js";
import blockWeekGoalRouter from './routes/12_week_goals.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// Middleware to protect /api routes
import { authenticate } from "./auth/jwt.js";
app.use(
  "/api",
  authenticate,
  objectivesRouter,
  dailyTaskRouter,
  yearlyVisionRouter,
  weeklyGoalRouter,
  blockWeekGoalRouter
);

mongoose
  .connect(MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
