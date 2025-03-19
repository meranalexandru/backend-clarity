import mongoose from "mongoose";

const weeklyGoalSchema = mongoose.Schema({
  weeklyGoalName: String,
  description: String,
  rewards: [
    {
      name: String,
      description: String,
    },
  ],
  obstacles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Obstacle",
    },
  ],
  isDone: Boolean,
});

const WeeklyGoal = mongoose.model("WeeklyGoal", weeklyGoalSchema);
export default WeeklyGoal;
