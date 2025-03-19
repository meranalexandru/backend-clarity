import mongoose from "mongoose";

const dailyTaskSchema = mongoose.Schema({
  taskName: String,
  description: String,
  rewards: [
    {
      name: String,
      description: String,
    },
  ],
  date: Date,
  environment: String,
  stacking: String,
  isElastic: Boolean, // Elastic task indicator
  isRecurrent: Boolean,
  recurrenceDays: [String],
  completionState: {
    type: String,
    enum: ["NOT_DONE", "MINI", "PLUS", "ELITE"],
    default: "NOT_DONE",
  },
});

const DailyTask = mongoose.model("DailyTask", dailyTaskSchema);

export default DailyTask;
