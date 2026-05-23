import express from "express";
import validateRequest from "../../../middleware/validateRequest.js";
import { checkAuthMiddleware } from "../../../middleware/checkAuthMiddleware.js";
import { createMulterUpload } from "../../../config/multer.config.js";
import { Role } from "../../../utils/role.js";
import { ServiceGuideValidation } from "./serviceGuide.validation.js";
import { ServiceGuideController } from "./serviceGuide.controller.js";

const upload = createMulterUpload({ folder: "" });
const router = express.Router();

router.post(
  "/",
  checkAuthMiddleware(...Object.values(Role)),
  upload.single("document"),
  validateRequest(ServiceGuideValidation.createServiceGuideSchema),
  ServiceGuideController.createServiceGuide
);

router.get(
  "/",
  checkAuthMiddleware(...Object.values(Role)),
  ServiceGuideController.getServiceGuides
);

router.get(
  "/:id",
  checkAuthMiddleware(...Object.values(Role)),
  ServiceGuideController.getServiceGuideById
);

router.patch(
  "/:id",
  checkAuthMiddleware(...Object.values(Role)),
  upload.single("document"),
  validateRequest(ServiceGuideValidation.updateServiceGuideSchema),
  ServiceGuideController.updateServiceGuide
);

router.delete(
  "/:id",
  checkAuthMiddleware(...Object.values(Role)),
  ServiceGuideController.deleteServiceGuide
);

export const ServiceGuideRoutes = router;
