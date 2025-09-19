import express from "express";
import { handleMulterErrors, uploadArtist } from "../multer.js";
import {
  createArtist,
  getArtist,
  getArtistById,
  updateArtist,
} from "../controllers/artistController.js";

const router = express.Router();

router.post(
  "/createArtist",
  uploadArtist.array("artist_image"),
  handleMulterErrors,
  createArtist
);
router.get("/getArtist", getArtist);
router.post("/getArtistById", getArtistById);
router.patch(
  "/updateArtist",
  uploadArtist.array("artist_image"),
  handleMulterErrors,
  updateArtist
);

export default router;
