import { Router } from "express";

const router = Router();
import noteController from "../controllers/noteController.js";
import verifyJWT from "../middleware/verifyJWT.js";
router.use(verifyJWT);

router.get("/", noteController.getNotes);
router.post("/", noteController.createNotes);
router.post("/collection", noteController.createCollection);
router.delete("/collection", noteController.deleteCollection);
router.get("/collection", noteController.getCollectionList);

router.delete("/", noteController.deleteNote);

export default router;
