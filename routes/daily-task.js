import express from "express";
import DailyTask from "../models/daily_task.js";
import Objective from "../models/objective.js";
import WeeklyGoal from "../models/weekly_goals.js";
import User from "../models/user.js";

const router = express.Router(); // Update a Daily Task by ID
router.put("/daily-tasks/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const updateData = req.body; // Contains the updated task data

  try {
    const updatedTask = await DailyTask.findByIdAndUpdate(taskId, updateData, {
      new: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task", error });
  }
});

// Update a Daily Task by ID
router.put("/daily-tasks/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const updateData = req.body; // Contains the updated task data

  try {
    const updatedTask = await DailyTask.findByIdAndUpdate(taskId, updateData, {
      new: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task", error });
  }
});

// Delete a daily task
router.delete("/daily-tasks/:taskId", async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await DailyTask.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await DailyTask.findByIdAndDelete(taskId);

    // Remove task reference from objectives
    await Objective.updateMany(
      { dailyTasks: taskId },
      { $pull: { dailyTasks: taskId } }
    );

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a daily task to a user's objective
router.post(
  "/users/:userId/objectives/:objectiveId/daily-tasks",
  async (req, res) => {
    const { userId, objectiveId } = req.params;
    const { taskName, description, rewards, environment, stacking } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const objective = await Objective.findById(objectiveId);
      if (!objective) {
        return res.status(404).json({ message: "Objective not found" });
      }

      // Create the task
      const newTask = new DailyTask({
        taskName,
        description,
        rewards,
        environment,
        stacking,
        date: new Date(),
      });

      await newTask.save();

      // Add task to the objective
      objective.dailyTasks.push(newTask._id);
      await objective.save();

      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.put("/daily-tasks/:taskId/completion", async (req, res) => {
  const { taskId } = req.params;
  const { completionState } = req.body;

  try {
    const updatedTask = await DailyTask.findByIdAndUpdate(
      taskId,
      { completionState },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Error updating task", err });
  }
});



export default router;
