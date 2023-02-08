import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyAdmin = async (req, res, next) => {
  const id = req.id;
  if (!id) return res.status(400).json({ message: "Something went wrong" });
  const foundUser = await User.findById(id);

  if (foundUser.roles !== "admin") {
    return res.status(400).json({ message: "Unauthorized" });
  } else {
    next();
  }
};


