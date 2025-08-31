import express from "express";
import { upload } from "../multer.js";
import {
  createCatgeory,
  getCategory,
  getCategoryById,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/createCategory", upload.single("category_image"), createCatgeory);
router.get("/getCategory", getCategory);
router.post("/getCategoryById", getCategoryById);
router.patch(
  "/updateCategory",
  upload.single("category_image"),
  updateCategory
);

export default router;
