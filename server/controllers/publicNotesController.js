import User from "../models/User.js";
import Note from "../models/Note.js";
import Collection from "../models/Collection.js";
import PublicNotes from "../models/PublicNotes.js";
import asyncHandler from "express-async-handler";
import formatBytes from "../config/formateByte.js";
import { getKey, setKey, deleteKey } from "../config/redis.js";
import containerClient from "../config/azureStorage.js";
import { university } from "../data/university.js";
import Favourite from "../models/Favourite.js";
import { json } from "express";
// Create notes
// Need admin right
export const getUniversity = asyncHandler(async (req, res) => {
  const universityName = [];
  for (const key in university) {
    universityName.push({ id: key, label: key, value: key });
  }

  res.status(200).json({ universityName });
});

export const getCourse = asyncHandler(async (req, res) => {
  const { selectedUniversity } = req.body;

  if (!selectedUniversity)
    return res.status(400).json({ message: "please provide valid inputs" });
  const course = university[selectedUniversity]?.course.map((c) => {
    return { label: c, value: c };
  });
  if (!course || !semester || !subject) {
    return res.status(400).json({ message: "university not found" });
  }

  res.status(200).json({ course });
});


export const getUniversityDetails = asyncHandler(async (req, res) => {
  const { selectedUniversity } = req.body;

  if (!selectedUniversity)
    return res.status(400).json({ message: "please provide valid inputs" });


  const subject = university[selectedUniversity]?.subject.map((s) => {
    return { label: s, value: s };
  });
  if (!subject) {
    return res.status(400).json({ message: "university not found" });
  }

  res.status(200).json({  subject });
});

export const searchNotes = asyncHandler(async (req, res) => {
  const {
    selectedUniversity,
   
    selectedSubject,
  } = req.body;

  if (
    !selectedUniversity ||

    !selectedSubject
  ) {
    return res.status(400).json({ message: "Please provide all details" });
  }

  const foundNotes = await PublicNotes.find({
    university: selectedUniversity,
  
    subject: selectedSubject,
  });
  const notes = foundNotes.map((i) => {
    return {
      id: i._id,
      name: i.name,
      url: i.url,
      size: i.size,
      uploadedBy: i.uploadedBy,
    };
  });
  res.status(200).json({ notes });
});

export const addToFav = asyncHandler(async (req, res) => {
  const { noteId } = req.body;
  if (!noteId) return res.status(200).json({ messag: "Provide valid input" });

  const foundNote = await PublicNotes.findById(noteId);

  const foundInFav = await Favourite.findOne({ parentNoteId: noteId });

  if (foundInFav) {
    return res.status(400).json({ message: "Already in favourite list" });
  }

  const created = await Favourite.create({
    parentNoteId: noteId,
    userId: req.id,
    name: foundNote.name,
    size: foundNote.size,
    url: foundNote.url,
  });

  res.status(200).json({ message: "Added to favourite" });
});

export const removeFav = asyncHandler(async (req, res) => {
  const { noteId } = req.body;

  await Favourite.findOneAndDelete({ _id: noteId });

  res.status(200).json({ message: "Removed from favourite list" });
});

export const getFavList = asyncHandler(async (req, res) => {
  if (!req.id) return res.status(400).json({ message: "Something went wrong" });
  const favlist = await Favourite.find({ userId: req.id });

  res.status(200).json({ favlist });
});
