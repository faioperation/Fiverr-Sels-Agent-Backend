import express from "express";
import validateRequest from "../../../middleware/validateRequest.js";
import { checkAuthMiddleware } from "../../../middleware/checkAuthMiddleware.js";
import { createMulterUpload } from "../../../config/multer.config.js";
import { Role } from "../../../utils/role.js";
import { AlternativeGuideValidation } from "./alternativeGuide.validation.js";
import { AlternativeGuideController } from "./alternativeGuide.controller.js";

const upload = createMulterUpload({ folder: "" });
const router = express.Router();

router.post(
  "/",
  checkAuthMiddleware(...Object.values(Role)),
  upload.single("document"),
  validateRequest(AlternativeGuideValidation.createAlternativeGuideSchema),
  AlternativeGuideController.createAlternativeGuide
);

router.get(
  "/",
  checkAuthMiddleware(...Object.values(Role)),
  AlternativeGuideController.getAlternativeGuides
);

router.get(
  "/:id",
  checkAuthMiddleware(...Object.values(Role)),
  AlternativeGuideController.getAlternativeGuideById
);

router.patch(
  "/:id",
  checkAuthMiddleware(...Object.values(Role)),
  upload.single("document"),
  validateRequest(AlternativeGuideValidation.updateAlternativeGuideSchema),
  AlternativeGuideController.updateAlternativeGuide
);

router.delete(
  "/:id",
  checkAuthMiddleware(...Object.values(Role)),
  AlternativeGuideController.deleteAlternativeGuide
);

export const AlternativeGuideRoutes = router;
