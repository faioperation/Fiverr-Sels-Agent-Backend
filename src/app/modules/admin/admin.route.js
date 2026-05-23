import express from "express";
import { AdminController } from "./admin.controller.js";
import { checkAuthMiddleware } from "../../middleware/checkAuthMiddleware.js";
import { Role } from "../../utils/role.js";

const router = express.Router();

router.get(
  "/users",
  checkAuthMiddleware(Role.SYSTEM_OWNER),
  AdminController.getAllUsers
);

router.get(
  "/users/:id",
  checkAuthMiddleware(Role.SYSTEM_OWNER),
  AdminController.getSingleUser
);

router.delete(
  "/users/:id",
  checkAuthMiddleware(Role.SYSTEM_OWNER),
  AdminController.deleteUser
);

export const AdminRoutes = router;
