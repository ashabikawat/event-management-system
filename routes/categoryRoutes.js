import express from "express";
import { handleMulterErrors, uploadCategories } from "../multer.js";
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
  handleMulterErrors,
  createCatgeory
);
router.get("/getCategory", getCategory);
router.post("/getCategoryById", getCategoryById);
router.patch(
  "/updateCategory",
  uploadCategories.single("category_image"),
  handleMulterErrors,
  updateCategory
);

export default router;
