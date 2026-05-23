import express from "express";
import validateRequest from "../../../middleware/validateRequest.js";
import { checkAuthMiddleware } from "../../../middleware/checkAuthMiddleware.js";
import { createMulterUpload } from "../../../config/multer.config.js";
import { Role } from "../../../utils/role.js";
import { AgentTrainingValidation } from "./agentTraining.validation.js";
import { AgentTrainingController } from "./agentTraining.controller.js";

const upload = createMulterUpload({ folder: "" });
const router = express.Router();

router.post(
  "/",
  checkAuthMiddleware(...Object.values(Role)),
  upload.single("document"),
  validateRequest(AgentTrainingValidation.createAgentTrainingSchema),
  AgentTrainingController.createAgentTraining
);

router.get(
  "/",
  checkAuthMiddleware(...Object.values(Role)),
  AgentTrainingController.getAgentTrainings
);

router.get(
  "/:id",
  checkAuthMiddleware(...Object.values(Role)),
  AgentTrainingController.getAgentTrainingById
);

router.patch(
  "/:id",
  checkAuthMiddleware(...Object.values(Role)),
  upload.single("document"),
  validateRequest(AgentTrainingValidation.updateAgentTrainingSchema),
  AgentTrainingController.updateAgentTraining
);

router.delete(
  "/:id",
  checkAuthMiddleware(...Object.values(Role)),
  AgentTrainingController.deleteAgentTraining
);

export const AgentTrainingRoutes = router;
