import express from "express";
import { createVenues, updateVenue } from "../controllers/venueController.js";
import { handleMulterErrors, uploadVenue } from "../multer.js";

const router = express.Router();

router.post(
  "/createVenue",
  uploadVenue.array("venue_image"),
  handleMulterErrors,
  createVenues
);

router.patch(
  "/updateVenue",
  uploadVenue.array("venue_image"),
  handleMulterErrors,
  updateVenue
);

export default router;
