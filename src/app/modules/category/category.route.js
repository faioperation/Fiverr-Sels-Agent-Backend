import express from "express";
import validateRequest from "../../middleware/validateRequest.js";
import { checkAuthMiddleware } from "../../middleware/checkAuthMiddleware.js";
import { Role } from "../../utils/role.js";
import { CategoryValidation } from "./category.validation.js";
import { CategoryController } from "./category.controller.js";

const router = express.Router();

router.post(
  "/create",
  checkAuthMiddleware(...Object.values(Role)),
  validateRequest(CategoryValidation.createCategorySchema),
  CategoryController.createCategory
);

router.get(
  "/all",
  checkAuthMiddleware(...Object.values(Role)),
  CategoryController.getAllCategories
);

router.get(
  "/:id",
  checkAuthMiddleware(...Object.values(Role)),
  CategoryController.getCategoryById
);

router.patch(
  "/:id",
  checkAuthMiddleware(...Object.values(Role)),
  validateRequest(CategoryValidation.updateCategorySchema),
  CategoryController.updateCategory
);

router.delete(
  "/:id",
  checkAuthMiddleware(...Object.values(Role)),
  CategoryController.deleteCategory
);

export const CategoryRoutes = router;
