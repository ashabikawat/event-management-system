import express from "express";
import {
  createRole,
  getAllRoles,
  getRole,
  updateRole,
} from "../controllers/rolesController.js";

const router = express.Router();

router.post("/createRole", createRole);
router.get("/getRole/:id", getRole);
router.get("/getRoles", getAllRoles);
router.post("/updateRole", updateRole);

export default router;
