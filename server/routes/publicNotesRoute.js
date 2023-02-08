import { Router } from "express";
import {
  addToFav,
  getFavList,
  getUniversity,
  getUniversityDetails,
  removeFav,
  searchNotes,
} from "../controllers/publicNotesController.js";
const router = Router();

import verifyJWT from "../middleware/verifyJWT.js";

router.get("/university", getUniversity);
router.post("/university", getUniversityDetails);
router.post("/search", searchNotes);
router.post("/add", verifyJWT, addToFav);
router.get("/favourite", verifyJWT, getFavList);
router.post("/deletefavourite", verifyJWT, removeFav);
export default router;
