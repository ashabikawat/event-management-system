import express from "express";
import { uploadCategories } from "../multer.js";
import {
  createCatgeory,
  getCategory,
  getCategoryById,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post(
  "/createCategory",
  uploadCategories.single("category_image"),
  createCatgeory
);
router.get("/getCategory", getCategory);
router.post("/getCategoryById", getCategoryById);
router.patch(
  "/updateCategory",
  uploadCategories.single("category_image"),
  updateCategory
);

export default router;
