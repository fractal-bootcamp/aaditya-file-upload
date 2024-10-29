// src/routes/fileRoutes.ts

import express from "express";
import multer from "multer";
import { uploadFile, getMyFiles } from "../controllers/fileController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", authenticateUser, upload.single("file"), uploadFile);
router.get("/my-files", authenticateUser, getMyFiles);

export default router;
