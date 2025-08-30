import express from "express";
import {
  createCatgeory,
  getCategory,
  getCategoryById,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/createCategory", createCatgeory);
router.get("/getCategory", getCategory);
router.post("/getCategoryById", getCategoryById);
router.patch("/updateCategory", updateCategory);

export default router;
