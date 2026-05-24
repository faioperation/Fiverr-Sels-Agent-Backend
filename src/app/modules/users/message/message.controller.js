import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../../utils/sendResponse.js";
import prisma from "../../../prisma/client.js";
import { MessageService } from "./message.service.js";
import { ConversationService } from "../conversation/conversation.service.js";
import { SalesBotService } from "../salesBot/salesBot.service.js";
import { ServiceGuideService } from "../serviceGuide/serviceGuide.service.js";
import { AlternativeGuideService } from "../alternativeGuide/alternativeGuide.service.js";
import DevBuildError from "../../../lib/DevBuildError.js";
import { envVars } from "../../../config/env.js";

const createMessage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let { conversationId, userQuery, documentUrl, documentPath, role, rowAiResponse } = req.body;

    if (req.file) {
      documentPath = `uploads/${req.file.filename}`;
      documentUrl = `${req.protocol}://${req.get('host')}/${documentPath}`;
    }

    let conversation;
    if (conversationId) {
      // Verify conversation belongs to user
      conversation = await ConversationService.findById(prisma, conversationId, userId);
      if (!conversation) {
        throw new DevBuildError("Conversation not found", StatusCodes.NOT_FOUND);
      }
    } else {
      let type = req.body.type || "GLOBAL";
      let aiModel = req.body.aiModel || "GPT";

      if (!req.body.aiModel) {
        if (type === "SALES_BOT") {
          const botConfig = await SalesBotService.findFirstByUserId(prisma, userId);
          if (botConfig && botConfig.modelName) aiModel = botConfig.modelName;
        } else if (type === "SERVICE_GUIDE") {
          const botConfig = await ServiceGuideService.findFirstByUserId(prisma, userId);
          if (botConfig && botConfig.modelName) aiModel = botConfig.modelName;
        } else if (type === "ALTERNATIVE_GUIDE") {
          const botConfig = await AlternativeGuideService.findFirstByUserId(prisma, userId);
          if (botConfig && botConfig.modelName) aiModel = botConfig.modelName;
        }
      }

      // Create a new conversation if not provided
      conversation = await ConversationService.create(prisma, {
        userId,
        name: req.body.name || "New Conversation",
        type: type,
        aiModel: aiModel,
      });
      conversationId = conversation.id;
    }

    const result = await MessageService.create(prisma, {
      conversationId,
      userId,
      role,
      userQuery,
      rowAiResponse,
      documentUrl,
      documentPath,
    });

    let aiResponseData = null;
    let agentMessage = null;
    if (envVars.AI_API) {
      try {
        let endpoint = "/full-analysis";
        if (conversation.type === "SALES_BOT") endpoint = "/sales-bot";
        else if (conversation.type === "SERVICE_GUIDE") endpoint = "/service-guide";
        else if (conversation.type === "ALTERNATIVE_GUIDE") endpoint = "/alternative-guide";

        const aiResponse = await fetch(`${envVars.AI_API}${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_input: userQuery,
            document_content: documentUrl || "",
            conversation_id: conversationId,
            ai_model: conversation.aiModel,
          }),
        });

        if (aiResponse.ok) {
          aiResponseData = await aiResponse.json();
          
          // Save AI response to DB as an AGENT message
          agentMessage = await MessageService.create(prisma, {
            conversationId,
            userId,
            role: "AGENT",
            userQuery: "",
            rowAiResponse: typeof aiResponseData === 'object' ? JSON.stringify(aiResponseData) : String(aiResponseData),
            documentUrl: null,
            documentPath: null,
          });
          // Parse it back to an object for the API response
          try {
            agentMessage.rowAiResponse = JSON.parse(agentMessage.rowAiResponse);
          } catch (e) {
            // Leave as string if parsing fails
          }
        } else {
          console.error("AI API Error:", aiResponse.statusText);
        }
      } catch (err) {
        console.error("Failed to call AI API:", err);
      }
    }

    sendResponse(res, {
      success: true,
      message: "Message created and AI responded successfully",
      statusCode: StatusCodes.CREATED,
      data: {
        userMessage: result,
        agentMessage: agentMessage,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMessagesByConversationId = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    // Verify conversation belongs to user
    const conversation = await ConversationService.findById(prisma, conversationId, userId);
    if (!conversation) {
      throw new DevBuildError("Conversation not found", StatusCodes.NOT_FOUND);
    }

    let result = await MessageService.findAllByConversationId(prisma, conversationId, userId);

    // Parse rowAiResponse for each message
    result = result.map(msg => {
      if (msg.rowAiResponse) {
        try {
          msg.rowAiResponse = JSON.parse(msg.rowAiResponse);
        } catch (e) {
          // Leave as string if it fails to parse
        }
      }
      return msg;
    });

    sendResponse(res, {
      success: true,
      message: "Messages retrieved successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMessageById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await MessageService.findById(prisma, id, userId);

    if (!result) {
      throw new DevBuildError("Message not found", StatusCodes.NOT_FOUND);
    }

    // Parse rowAiResponse
    if (result.rowAiResponse) {
      try {
        result.rowAiResponse = JSON.parse(result.rowAiResponse);
      } catch (e) {
        // Leave as string
      }
    }

    sendResponse(res, {
      success: true,
      message: "Message retrieved successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateMessage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    let { userQuery, documentUrl, documentPath, role, rowAiResponse } = req.body;

    if (req.file) {
      documentPath = `uploads/${req.file.filename}`;
      documentUrl = `${req.protocol}://${req.get('host')}/${documentPath}`;
    }

    const existing = await MessageService.findById(prisma, id, userId);
    if (!existing) {
      throw new DevBuildError("Message not found", StatusCodes.NOT_FOUND);
    }

    const result = await MessageService.update(prisma, id, userId, {
      userQuery,
      role,
      rowAiResponse,
      documentUrl,
      documentPath,
    });

    sendResponse(res, {
      success: true,
      message: "Message updated successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const existing = await MessageService.findById(prisma, id, userId);
    if (!existing) {
      throw new DevBuildError("Message not found", StatusCodes.NOT_FOUND);
    }

    await MessageService.softDelete(prisma, id, userId);

    sendResponse(res, {
      success: true,
      message: "Message deleted successfully",
      statusCode: StatusCodes.OK,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const MessageController = {
  createMessage,
  getMessagesByConversationId,
  getMessageById,
  updateMessage,
  deleteMessage,
};
