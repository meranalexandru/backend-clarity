import express from "express";
import BlockWeekGoal from "../models/12_week_goal.js";
import Objective from "../models/objective.js";
import { authenticate } from "../auth/jwt.js"; // Assuming you are using JWT for authentication

const router = express.Router();

// ✅ **Create a Block Week Goal**
router.post(
  "/objectives/:objectiveId/block-week-goals",
  authenticate,
  async (req, res) => {
    const { objectiveId } = req.params;
    const { blockWeekGoalName, description, rewards, obstacles } = req.body;

    try {
      const objective = await Objective.findById(objectiveId);
      if (!objective) {
        return res.status(404).json({ message: "Objective not found" });
      }

      // Create new Block Week Goal
      const newGoal = new BlockWeekGoal({
        blockWeekGoalName,
        description,
        rewards,
        obstacles,
      });

      await newGoal.save();

      // Add goal to the objective
      objective.blockWeekGoals.push(newGoal._id);
      await objective.save();

      res.status(201).json(newGoal);
    } catch (error) {
      console.error("Error creating block week goal:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// ✅ **Get all Block Week Goals for an Objective**
router.get(
  "/objectives/:objectiveId/block-week-goals",
  authenticate,
  async (req, res) => {
    try {
      const { objectiveId } = req.params;
      const objective = await Objective.findById(objectiveId).populate(
        "blockWeekGoals"
      );

      if (!objective) {
        return res.status(404).json({ message: "Objective not found" });
      }

      res.json(objective.blockWeekGoals);
    } catch (error) {
      console.error("Error fetching block week goals:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// ✅ **Update a Block Week Goal**
router.put(
  "/block-week-goals/:goalId",
  authenticate,
  async (req, res) => {
    const { goalId } = req.params;
    const { blockWeekGoalName, description, rewards, obstacles } = req.body;

    try {
      const updatedGoal = await BlockWeekGoal.findByIdAndUpdate(
        goalId,
        { blockWeekGoalName, description, rewards, obstacles },
        { new: true }
      );

      if (!updatedGoal) {
        return res.status(404).json({ message: "Block Week Goal not found" });
      }

      res.json(updatedGoal);
    } catch (error) {
      console.error("Error updating block week goal:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// ✅ **Delete a Block Week Goal**
router.delete(
  "/block-week-goals/:goalId",
  authenticate,
  async (req, res) => {
    const { goalId } = req.params;

    try {
      const deletedGoal = await BlockWeekGoal.findByIdAndDelete(goalId);

      if (!deletedGoal) {
        return res.status(404).json({ message: "Block Week Goal not found" });
      }

      res.json({ message: "Block Week Goal deleted successfully" });
    } catch (error) {
      console.error("Error deleting block week goal:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export default router;
