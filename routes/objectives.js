import express from "express";
import Objective from "../models/objective.js";
import DailyTask from "../models/daily_task.js"; // ✅ Ensure this import exists
import User from "../models/user.js";

const router = express.Router();

// POST: Create a new Objective
router.post("/objectives", async (req, res) => {
  const {
    objectiveName,
    description,
    dailyTasks,
    weeklyGoals,
    blockWeekGoals,
    yearlyGoals,
  } = req.body;

  const newObjective = new Objective({
    objectiveName,
    description,
    dailyTasks,
    weeklyGoals,
    blockWeekGoals,
    yearlyGoals,
  });

  try {
    const savedObjective = await newObjective.save();
    res.status(201).json(savedObjective);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST: Create a new Objective in a user account
router.post("/users/:userId/objectives", async (req, res) => {
  // ✅ Correct route
  const { userId } = req.params;
  console.log("Received request to create objective for user:", userId);

  const {
    objectiveName,
    description,
    dailyTasks,
    weeklyGoals,
    blockWeekGoals,
    yearlyGoals,
  } = req.body;

  try {
    // Ensure user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new objective
    const newObjective = new Objective({
      objectiveName,
      description: description || "",
      dailyTasks: dailyTasks || [],
      weeklyGoals: weeklyGoals || [],
      blockWeekGoals: blockWeekGoals || [],
      yearlyGoals: yearlyGoals || [],
    });

    // Save the objective
    const savedObjective = await newObjective.save();

    // Associate objective with the user
    user.objectives.push(savedObjective._id);
    await user.save();

    // Return the created objective
    res.status(201).json(savedObjective);
  } catch (error) {
    console.error("Error creating objective:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// DELETE: Delete an Objective by ID
router.delete("/objectives/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const objective = await Objective.findById(id);
    if (!objective) {
      return res.status(404).json({ message: "Objective not found" });
    }

    await objective.deleteOne();
    res.status(200).json({ message: "Objective deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Get all objectives
router.get("/objectives", async (req, res) => {
  try {
    const objectives = await Objective.find();
    res.status(200).json(objectives);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a daily task to an objective
router.post("/objectives/:id/daily-tasks", async (req, res) => {
  const { id } = req.params;
  const { taskName, description, rewards, environment, stacking } = req.body;

  try {
    // Check if the objective exists
    const objective = await Objective.findById(id);
    if (!objective) {
      return res.status(404).json({ message: "Objective not found" });
    }

    // Create a new DailyTask
    const newTask = new DailyTask({
      taskName,
      description,
      rewards,
      environment,
      stacking,
      date: new Date(), // Add timestamp
    });

    await newTask.save(); // Save the task in the DB

    // Associate the task with the objective
    objective.dailyTasks.push(newTask._id);
    await objective.save();

    // Return the newly created task
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error adding daily task:", error);
    res.status(500).json({ message: error.message });
  }
});

// Fetch tasks for a specific objective
router.get("/objectives/:id/daily-tasks", async (req, res) => {
  try {
    const objective = await Objective.findById(req.params.id).populate(
      "dailyTasks"
    );
    if (!objective) {
      return res.status(404).json({ message: "Objective not found" });
    }

    res.status(200).json(objective.dailyTasks);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks", error });
  }
});

// POST: Create a new Objective for a User
router.post("/objectives", async (req, res) => {
  const {
    userId,
    objectiveName,
    description,
    dailyTasks,
    weeklyGoals,
    blockWeekGoals,
    yearlyGoals,
  } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newObjective = new Objective({
      user: userId,
      objectiveName,
      description,
      dailyTasks,
      weeklyGoals,
      blockWeekGoals,
      yearlyGoals,
    });

    await newObjective.save();

    // Add the objective to the user's objectives list
    user.objectives.push(newObjective._id);
    await user.save();

    res.status(201).json(newObjective);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Get all objectives for a user
router.get("/users/:userId/objectives", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("objectives");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.objectives);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE: Remove an objective for a user
router.delete("/users/:userId/objectives/:objectiveId", async (req, res) => {
  const { userId, objectiveId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const objective = await Objective.findById(objectiveId);
    if (!objective) {
      return res.status(404).json({ message: "Objective not found" });
    }

    // Remove the objective from user's list
    user.objectives = user.objectives.filter(
      (objId) => objId.toString() !== objectiveId
    );
    await user.save();

    // Delete the objective
    await Objective.findByIdAndDelete(objectiveId);

    res.status(200).json({ message: "Objective deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
