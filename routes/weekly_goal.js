import express from "express";
import Objective from "../models/objective.js";
import WeeklyGoal from "../models/weekly_goals.js";

const router = express.Router(); // Update a Daily Task by ID

// Get all weekly goals for an objective
router.get("/objectives/:objectiveId/weekly-goals", async (req, res) => {
  try {
    const { objectiveId } = req.params; // ✅ Fix extraction

    // ✅ Fix: Populate weekly goals
    const objectiveFound = await Objective.findById(objectiveId).populate(
      "weeklyGoals"
    );

    if (!objectiveFound) {
      return res.status(404).json({ error: "Objective not found" });
    }

    res.json(objectiveFound.weeklyGoals); // ✅ Return full objects
  } catch (error) {
    console.error("Error fetching weekly goals:", error);
    res.status(500).json({ error: "Failed to fetch weekly goals" });
  }
});

// Add a new weekly goal
router.post("/objectives/:objectiveId/weekly-goals", async (req, res) => {
  try {
    const { weeklyGoalName, description } = req.body;
    const newGoal = new WeeklyGoal({
      weeklyGoalName,
      description,
      objective: req.params.objectiveId,
    });
    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({ error: "Failed to add weekly goal" });
  }
});

// Update a weekly goal
router.put("/weekly-goals/:goalId", async (req, res) => {
  try {
    const { weeklyGoalName, description, isDone } = req.body;
    const updatedGoal = await WeeklyGoal.findByIdAndUpdate(
      req.params.goalId,
      { weeklyGoalName, description, isDone },
      { new: true }
    );

    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ error: "Failed to update weekly goal" });
  }
});

// Delete a weekly goal
router.delete("/weekly-goals/:goalId", async (req, res) => {
  try {
    await WeeklyGoal.findByIdAndDelete(req.params.goalId);
    res.json({ message: "Weekly goal deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete weekly goal" });
  }
});

router.post(
  "/users/:userId/objectives/:objectiveId/weekly-goals",
  async (req, res) => {
    try {
      const { userId, objectiveId } = req.params;
      const { weeklyGoalName, description, rewards } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
      }

      const objective = await Objective.findById(objectiveId);
      if (!objective) {
        res.status(404).json({ message: "Objective not found" });
      }

      const newWeeklyGoal = new WeeklyGoal({
        weeklyGoalName,
        description,
        rewards,
        objective: objectiveId,
      });

      await newWeeklyGoal.save();

      objective.weeklyGoals = objective.weeklyGoals || [];
      objective.weeklyGoals.push(newWeeklyGoal._id);
      await objective.save();
      res.status(201).json(newWeeklyGoal);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;
