import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../../utils/sendResponse.js";
import prisma from "../../../prisma/client.js";
import { ConversationService } from "./conversation.service.js";
import DevBuildError from "../../../lib/DevBuildError.js";

const createConversation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, type, aiModel } = req.body;

    const result = await ConversationService.create(prisma, {
      userId,
      name,
      type: type || "GLOBAL",
      aiModel: aiModel || "GPT",
    });

    sendResponse(res, {
      success: true,
      message: "Conversation created successfully",
      statusCode: StatusCodes.CREATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await ConversationService.findAllByUserId(prisma, userId);

    sendResponse(res, {
      success: true,
      message: "Conversations retrieved successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getConversationById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await ConversationService.findById(prisma, id, userId);

    if (!result) {
      throw new DevBuildError("Conversation not found", StatusCodes.NOT_FOUND);
    }

    sendResponse(res, {
      success: true,
      message: "Conversation retrieved successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateConversation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, type, aiModel } = req.body;

    // Check if it exists and belongs to the user
    const existing = await ConversationService.findById(prisma, id, userId);
    if (!existing) {
      throw new DevBuildError("Conversation not found", StatusCodes.NOT_FOUND);
    }

    const result = await ConversationService.update(prisma, id, userId, {
      name,
      type,
      aiModel,
    });

    sendResponse(res, {
      success: true,
      message: "Conversation updated successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteConversation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Check if it exists and belongs to the user
    const existing = await ConversationService.findById(prisma, id, userId);
    if (!existing) {
      throw new DevBuildError("Conversation not found", StatusCodes.NOT_FOUND);
    }

    await ConversationService.softDelete(prisma, id, userId);

    sendResponse(res, {
      success: true,
      message: "Conversation deleted successfully",
      statusCode: StatusCodes.OK,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const ConversationController = {
  createConversation,
  getAllConversations,
  getConversationById,
  updateConversation,
  deleteConversation,
};
