import mongoose, { mongo } from "mongoose";

const yearlyGoalSchema = mongoose.Schema({
  yearlyGoalName: String,
  vision: String,
  antiVision: String,
  obstacles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Obstacle"
    },
  ],
});

const YearlyGoal = mongoose.model("YearlyGoal", yearlyGoalSchema);
export default YearlyGoal;
