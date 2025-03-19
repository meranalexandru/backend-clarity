import express from "express";
import User from "../models/user.js";
import Objective from "../models/objective.js";
import YearlyGoal from "../models/year_goal.js";

const router = express.Router(); // Update a Daily Task by ID

router.get(
  "/yearly/:userId/objectives/:objectiveId/yearly-goal/vision",
  async (req, res) => {
    try {
      const { userId, objectiveId } = req.params;

      // Find the objective and populate its YearlyGoal
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      let objectiveIds = user.objectives.map((objective) =>
        objective._id.toString().trim()
      );

      if (!objectiveIds.includes(objectiveId)) {
        return res
          .status(403)
          .json({ error: "Objective does not belong to the user" });
      }
      const objective = await Objective.findById(objectiveId).populate(
        "yearlyGoal"
      );

      res.json(objective.yearlyGoal);
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

router.put(
  "/yearly/:userId/objectives/:objectiveId/yearly-goal/vision",
  async (req, res) => {
    try {
      const { vision } = req.body;
      const { userId, objectiveId } = req.params;

      // Find the objective and populate its YearlyGoal
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      let objectiveIds = user.objectives.map((objective) =>
        objective._id.toString().trim()
      );

      if (!objectiveIds.includes(objectiveId)) {
        return res
          .status(403)
          .json({ error: "Objective does not belong to the user" });
      }

      const objective = await Objective.findById(objectiveId).populate(
        "yearlyGoal"
      );

      if (!objective || !objective.yearlyGoal) {
        return res
          .status(404)
          .json({ error: "Yearly goal not found for this objective" });
      }

      const yearlyGoalId = objective.yearlyGoal._id;

      const updatedGoal = await YearlyGoal.findByIdAndUpdate(
        yearlyGoalId,
        { vision },
        { new: true }
      );

      res.json(updatedGoal);
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

router.put(
  "/yearly/:userId/objectives/:objectiveId/yearly-goal/anti-vision",
  async (req, res) => {
    try {
      const { antiVision } = req.body;
      const { userId, objectiveId } = req.params;

      // Find the objective and populate its YearlyGoal
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      let objectiveIds = user.objectives.map((objective) =>
        objective._id.toString().trim()
      );

      if (!objectiveIds.includes(objectiveId)) {
        return res
          .status(403)
          .json({ error: "Objective does not belong to the user" });
      }

      const objective = await Objective.findById(objectiveId).populate(
        "yearlyGoal"
      );

      if (!objective || !objective.yearlyGoal) {
        return res
          .status(404)
          .json({ error: "Yearly goal not found for this objective" });
      }

      const yearlyGoalId = objective.yearlyGoal._id;

      const updatedGoal = await YearlyGoal.findByIdAndUpdate(
        yearlyGoalId,
        { antiVision },
        { new: true }
      );

      res.json(updatedGoal);
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

export default router;
