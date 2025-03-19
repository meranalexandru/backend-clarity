import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract token after "Bearer"
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET); // Use secret key from .env
    req.user = verified; // Attach user data to the request object
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};
