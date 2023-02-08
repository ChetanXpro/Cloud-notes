import { Router } from "express";

const router = Router();
import { createNotes } from "../controllers/adminController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import verifyJWT from "../middleware/verifyJWT.js";

router.post("/addnote", verifyJWT, verifyAdmin, createNotes);

export default router;
