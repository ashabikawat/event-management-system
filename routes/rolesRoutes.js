import express from "express";
import {
  createRole,
  getAllRoles,
  getMenus,
  getRole,
  updateRole,
} from "../controllers/rolesController.js";

const router = express.Router();

router.post("/createRole", createRole);
router.post("/getRole", getRole);
router.get("/getRoles", getAllRoles);
router.patch("/updateRole", updateRole);
router.get("/getMenus", getMenus);

export default router;
