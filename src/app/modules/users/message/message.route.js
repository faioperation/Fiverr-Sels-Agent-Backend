import express from "express";
import validateRequest from "../../../middleware/validateRequest.js";
import { checkAuthMiddleware } from "../../../middleware/checkAuthMiddleware.js";
import { createMulterUpload } from "../../../config/multer.config.js";
import { Role } from "../../../utils/role.js";
import { MessageValidation } from "./message.validation.js";
import { MessageController } from "./message.controller.js";

const upload = createMulterUpload({ folder: "" });

const router = express.Router();

router.post(
  "/",
  checkAuthMiddleware(...Object.values(Role)),
  upload.single("document"),
  validateRequest(MessageValidation.createMessageSchema),
  MessageController.createMessage
);

router.get(
  "/conversation/:conversationId",
  checkAuthMiddleware(...Object.values(Role)),
  MessageController.getMessagesByConversationId
);

router.get(
  "/:id",
  checkAuthMiddleware(...Object.values(Role)),
  MessageController.getMessageById
);

router.patch(
  "/:id",
  checkAuthMiddleware(...Object.values(Role)),
  upload.single("document"),
  validateRequest(MessageValidation.updateMessageSchema),
  MessageController.updateMessage
);

router.delete(
  "/:id",
  checkAuthMiddleware(...Object.values(Role)),
  MessageController.deleteMessage
);

export const MessageRoutes = router;
