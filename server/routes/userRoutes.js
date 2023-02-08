import { Router } from "express";

const router = Router();
import userController from "../controllers/userController.js";
import verifyJWT from "../middleware/verifyJWT.js";

// router.use(verifyJWT);

router.post("/", userController.createNewUser);
router.get("/getUser", verifyJWT, userController.getUserById);

router.patch("/", verifyJWT, userController.updateUser);
router.delete("/", verifyJWT, userController.deleteUser);

export default router;
