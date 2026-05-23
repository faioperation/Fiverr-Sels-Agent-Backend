import express from "express";
import { AddUserController } from "./addUser.controller.js";
import { checkAuthMiddleware } from "../../middleware/checkAuthMiddleware.js";
import { Role } from "../../utils/role.js";
import validateRequest from "../../middleware/validateRequest.js";
import { AddUserValidation } from "./addUser.validation.js";

const router = express.Router();

// Only SYSTEM_OWNER can access these routes
router.use(checkAuthMiddleware(Role.SYSTEM_OWNER));

router.post(
  "/",
  validateRequest(AddUserValidation.createUserSchema),
  AddUserController.createUser
);

router.get("/", AddUserController.getAllUsers);

router.get("/:id", AddUserController.getUserById);

router.patch(
  "/:id",
  validateRequest(AddUserValidation.updateUserSchema),
  AddUserController.updateUser
);

router.delete("/:id", AddUserController.deleteUser);

export const AddUserRoutes = router;
