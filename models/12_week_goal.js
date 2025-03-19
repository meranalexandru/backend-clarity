import mongoose from "mongoose";

const BlockWeekGoalSchema = mongoose.Schema({
  blockWeekGoalName: String,
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
});

const BlockWeekGoal = mongoose.model("BlockWeekGoal", BlockWeekGoalSchema);
export default BlockWeekGoal;
