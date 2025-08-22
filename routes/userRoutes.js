import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  login,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/createUser", createUser);
router.get("/getUserById", getUserById);
router.get("/getUsers", getAllUsers);
router.patch("/updateUser", updateUser);
router.post("/login", login);

export default router;
