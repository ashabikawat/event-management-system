import express from "express";
import { uploadArtist } from "../multer.js";
import { createArtist } from "../controllers/artistController.js";

const router = express.Router();

router.post("/createArtist", uploadArtist.array("artist_image"), createArtist);

export default router;
