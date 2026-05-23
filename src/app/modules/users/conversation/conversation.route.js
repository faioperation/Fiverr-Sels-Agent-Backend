import express from "express";
import validateRequest from "../../../middleware/validateRequest.js";
import { checkAuthMiddleware } from "../../../middleware/checkAuthMiddleware.js";
import { Role } from "../../../utils/role.js";
import { ConversationValidation } from "./conversation.validation.js";
import { ConversationController } from "./conversation.controller.js";

const router = express.Router();

router.post(
  "/",
  checkAuthMiddleware(...Object.values(Role)),
  validateRequest(ConversationValidation.createConversationSchema),
  ConversationController.createConversation
);

router.get(
  "/all",
  checkAuthMiddleware(...Object.values(Role)),
  ConversationController.getAllConversations
);

router.get(
  "/:id",
  checkAuthMiddleware(...Object.values(Role)),
  ConversationController.getConversationById
);

router.patch(
  "/:id",
  checkAuthMiddleware(...Object.values(Role)),
  validateRequest(ConversationValidation.updateConversationSchema),
  ConversationController.updateConversation
);

router.delete(
  "/:id",
  checkAuthMiddleware(...Object.values(Role)),
  ConversationController.deleteConversation
);

export const ConversationRoutes = router;
