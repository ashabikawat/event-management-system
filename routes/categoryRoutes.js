import express from "express";
import multer from "multer";
import {
  createCatgeory,
  getCategory,
  getCategoryById,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
});

router.post("/createCategory", upload.single("category_image"), createCatgeory);
router.get("/getCategory", getCategory);
router.post("/getCategoryById", getCategoryById);
router.patch("/updateCategory", updateCategory);

export default router;
