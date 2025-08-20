import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/createUser", createUser);
router.get("/getUserById", getUserById);
router.get("/getUsers", getAllUsers);
router.patch("/updateUser", updateUser);

export default router;
