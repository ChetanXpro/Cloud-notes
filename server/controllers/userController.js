import User from "../models/User.js";
import Note from "../models/Note.js";

import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { getKey, setKey } from "../config/redis.js";
import fs from "fs";

// @ Create new user
const createNewUser = asyncHandler(async (req, res) => {
  const { role, name, email, password } = req.body;

  if (!name || !password || !email) {
    return res.status(400).json({ message: "Al fields are require" });
  }

  const duplicates = await User.find({ email }).lean().exec();

  if (duplicates.length) {
    return res.status(409).json({
      message: "Email already exist",
    });
  }
  console.log(process.env.SALT);
  const hashedPwd = await bcrypt.hash(password, 10);

  const userObject = { email, password: hashedPwd, role, name };

  const user = await User.create(userObject);

  if (!user) res.status(400).json({ messssage: `Invalid user data recevied` });

  res.status(201).json({ message: `New user ${email} created` });
});

const getUserById = asyncHandler(async (req, res) => {
  const id = req.id;

  if (!id) {
    return res
      .sendStatus(500)
      .json({ success: false, message: "something went wrong" });
  }

  const cacheUser = await getKey(id);
  

  if (cacheUser) {
    const parseData = JSON.parse(cacheUser);
    console.log("User found in cache");
    return res.status(200).json({
      email: parseData.email,
      name: parseData.name,
      role: parseData.role,
    });
  }

  const foundUser = await User.findById(id);

  if (!foundUser)
    return res
      .status(400)
      .json({ success: false, message: "No user found with this id" });

  const userInfo = {
    email: foundUser.email,
    name: foundUser.name,
    role: foundUser.roles,
  };
 
  await setKey(id, JSON.stringify(userInfo), 3600);
  res.status(200).json(userInfo);
});

// @ Update user
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, cid } = req.body;

  if (!id || !username || !id) {
    return res
      .status(400)
      .json({ message: "All fields except password are required" });
  }
  // Does the user exist to update?
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  // Check for duplicate
  const foundUser = await User.findOne({ username }).lean().exec();

  foundUser.cid = cid;

  const updatedUser = await foundUser.save();

  res.json({ message: `${updatedUser.username} updated` });
});

// @ Deete user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  // Does the user exist to delete?
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await user.deleteOne();

  const reply = `User${result.username} with ID ${result._id} deleted`;

  res.json(reply);
});

export default {
  createNewUser,
  updateUser,
  deleteUser,
  getUserById,
};
