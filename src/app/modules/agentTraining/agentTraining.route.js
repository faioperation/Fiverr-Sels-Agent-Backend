import express from "express";
import validateRequest from "../../middleware/validateRequest.js";
import { checkAuthMiddleware } from "../../middleware/checkAuthMiddleware.js";
import { createMulterUpload } from "../../config/multer.config.js";
import { Role } from "../../utils/role.js";
import { AgentTrainingValidation } from "./agentTraining.validation.js";
import { AgentTrainingController } from "./agentTraining.controller.js";

const upload = createMulterUpload({ folder: "" });
const router = express.Router();

// Only SYSTEM_OWNER can access these routes
router.use(checkAuthMiddleware(Role.SYSTEM_OWNER));

router.post(
  "/",
  upload.single("document"),
  validateRequest(AgentTrainingValidation.createAgentTrainingSchema),
  AgentTrainingController.createAgentTraining
);

router.get(
  "/",
  AgentTrainingController.getAgentTrainings
);

router.get(
  "/:id",
  AgentTrainingController.getAgentTrainingById
);

router.patch(
  "/:id",
  upload.single("document"),
  validateRequest(AgentTrainingValidation.updateAgentTrainingSchema),
  AgentTrainingController.updateAgentTraining
);

router.delete(
  "/:id",
  AgentTrainingController.deleteAgentTraining
);

export const AgentTrainingRoutes = router;
