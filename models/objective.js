import mongoose from "mongoose";
import YearlyGoal from "./year_goal.js";

const objectiveSchema = mongoose.Schema({
  objectiveName: String,
  description: String,
  dailyTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DailyTask",
    },
  ],
  weeklyGoals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WeeklyGoal",
    },
  ],
  blockWeekGoals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlockWeekGoal",
    },
  ],
  yearlyGoal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "YearlyGoal",
  },
});

objectiveSchema.post("save", async function (doc, next) {
  try {
    if (!doc.yearlyGoal) {
      const yearlyGoal = await YearlyGoal.create({});
      doc.yearlyGoal = yearlyGoal._id;
      await doc.save();
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Objective = mongoose.model("Objective", objectiveSchema);

export default Objective;
