import User from "../models/User.js";
import Note from "../models/Note.js";
import Collection from "../models/Collection.js";
import PublicNotes from "../models/PublicNotes.js";
import asyncHandler from "express-async-handler";
import formatBytes from "../config/formateByte.js";
import { getKey, setKey, deleteKey } from "../config/redis.js";
import containerClient from "../config/azureStorage.js";
import { university } from "../data/university.js";

// Create notes
export const createNotes = asyncHandler(async (req, res) => {
  const { university, subject, name, url, fileSize } = req.body;

  if (!university || !subject || !name || !url || !fileSize) {
    res.json({ message: "Please provide all inputs" });
  }

  const created = await PublicNotes.create({
    name,
    url,
    size: formatBytes(fileSize),
    university,

    uploadedBy: req.id,
    subject,
  });
  console.log(created);

  res.status(200).json({ success: true, message: "Note Uploaded" });
});
