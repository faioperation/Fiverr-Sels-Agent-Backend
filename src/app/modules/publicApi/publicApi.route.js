import express from "express";
import { PublicApiController } from "./publicApi.controller.js";

const router = express.Router();

router.get("/users", PublicApiController.getAllUsers);
router.get("/conversations", PublicApiController.getAllConversations);
router.get("/conversations/user/:userId", PublicApiController.getConversationsByUserId);
router.get("/messages", PublicApiController.getAllMessages);
router.get("/messages/user/:userId", PublicApiController.getAllMessagesByUserId);
router.get("/messages/conversation/:conversationId", PublicApiController.getMessagesByConversationId);
router.get("/agent-trainings", PublicApiController.getAllAgentTrainings);

export const PublicApiRoutes = router;