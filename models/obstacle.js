import mongoose from "mongoose";

const obstacleSchema = mongoose.Schema({
  obstacleName: String,
  description: String,
  overcomingStrategy: String,
});

const Obstacle = mongoose.model("Obstacle", obstacleSchema);
export default Obstacle;
