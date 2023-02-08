import User from "../models/User.js";
import Note from "../models/Note.js";
import Collection from "../models/Collection.js";
import asyncHandler from "express-async-handler";
import formatBytes from "../config/formateByte.js";
import { getKey, setKey, deleteKey } from "../config/redis.js";
import containerClient from "../config/azureStorage.js";

import PublicNotes from "../models/PublicNotes.js";

// Create collection
const createCollection = asyncHandler(async (req, res) => {
  if (!req.id)
    return res
      .status(400)
      .json({ success: false, message: "Something went wrong" });
  const { collectionName } = req.body;
  if (!collectionName)
    return res.status(400).json({ success: false, message: "Invalid input" });
  const isCollectionAlreadyExist = await Collection.findOne({
    title: collectionName,
    user: req.id,
  });

  if (isCollectionAlreadyExist)
    return res
      .status(400)
      .json({ success: false, message: "Collection already exist" });

  await Collection.create({
    user: req.id,
    title: collectionName,
    totalNotesInside: 0,
  });

  await deleteKey(`Collection${req.id}`);

  res
    .status(200)
    .json({ success: true, message: `${collectionName} collection created` });
});

const getCollectionList = asyncHandler(async (req, res) => {
  const id = req.id;

  if (!id)
    return res
      .status(400)
      .json({ success: false, message: "Something went wrong" });

  const cache = await getKey(`Collection${id}`);

  if (cache) {
    const arr = JSON.parse(cache);
    console.log(`Found collection in cache`);
    return res.status(200).json({ ...arr });
  }

  const collectionFound = await Collection.find({
    user: id,
  }).lean();

  const arr = collectionFound.map((i) => {
    const obj = {
      id: i._id,
      label: i.title,
      value: i.title,
      totalNotesInside: i.totalNotesInside,
    };
    return obj;
  });

  await setKey(`Collection${id}`, JSON.stringify({ arr }));

  res.status(200).json({ arr });
});

// Create notes
const createNotes = asyncHandler(async (req, res) => {
  const { collectionName, noteName, url, fileSize, blobName } = req.body;

  if (
    typeof (collectionName || noteName || url) !== "string" &&
    !fileSize &&
    !blobName
  )
    return res.status(400).json({ success: false, message: "Invalid data" });

  const size = formatBytes(fileSize);

  const collectionFound = await Collection.findOne({ title: collectionName });

  if (!collectionFound)
    return res.status(400).json({
      success: false,
      message: `${collectionName} Collection does not exist`,
    });

  await Note.create({
    name: noteName,
    userId: req.id,
    url,
    size,
    blobName,
    collectionID: collectionFound._id,
  });

  await collectionFound.updateOne({ $inc: { totalNotesInside: +1 } });

  await deleteKey(`Notes${collectionFound._id}`);
  await deleteKey(`Collection${req.id}`);

  res.status(200).json({ success: true, message: "Note Uploaded" });
});

const getNotes = asyncHandler(async (req, res) => {
  const { collectionID } = req.query;

  if (!collectionID || collectionID.length !== 24)
    return res.status(400).json({
      success: false,
      message: "Please provide a valid collection id",
    });

  const cache = await getKey(`Notes${collectionID}`);

  if (cache) {
    const arr = JSON.parse(cache);
    console.log(`Found Notes in cache`);
    return res.status(200).json({ ...arr });
  }

  const foundNotes = await Note.find({
    collectionID: collectionID,
  });

  const arr = foundNotes.map((i) => {
    const obj = {
      id: i._id,
      name: i.name,
      size: i.size,
      url: i.url,
    };
    return obj;
  });

  await setKey(`Notes${collectionID}`, JSON.stringify({ arr }));

  res.status(200).json({ arr });
});

const deleteNote = asyncHandler(async (req, res) => {
  const { noteID } = req.query;

  if (!noteID || noteID.length !== 24)
    return res.status(400).json({
      success: false,
      message: "Please provide a valid collection id",
    });

  const foundNote = await Note.findOne({ _id: noteID, userId: req.id });
  await containerClient.deleteBlob(foundNote.blobName);

  if (!foundNote)
    return res.status(400).json({ success: false, message: "No note found" });

  const collectionFound = await Collection.findById(foundNote.collectionID);

  await collectionFound.updateOne({ $inc: { totalNotesInside: -1 } });

  const cc = await foundNote.deleteOne();

  await deleteKey(`Notes${collectionFound._id}`);
  await deleteKey(`Collection${req.id}`);

  res.status(200).json({ success: true, message: "note deleted" });
});

const deleteCollection = asyncHandler(async (req, res) => {
  const { collectionID } = req.query;

  if (!collectionID || collectionID.length !== 24)
    return res.status(400).json({
      success: false,
      message: "Please provide a valid collection id",
    });

  const { acknowledged, deletedCount } = await Collection.deleteOne({
    _id: collectionID,
    user: req.id,
  });

  if (!deletedCount)
    return res.status(400).json({ success: false, message: "No folder found" });

  const notes = await Note.find({ collectionID, userId: req.id });

  let promise = [];
  notes.forEach((i) => {
    promise.push(containerClient.deleteBlob(i.blobName));
  });

  const resol = await Promise.allSettled(promise);

  await deleteMany({ collectionID, userId: req.id });

  await deleteKey(`Collection${req.id}`);

  res.status(200).json({ success: true, message: "Folder deleted" });
});



export default {
  createCollection,

  deleteNote,
  getCollectionList,
  createNotes,
  deleteCollection,
  getNotes,
};
