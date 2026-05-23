import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse.js";
import prisma from "../../prisma/client.js";

const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        isVerified: true,
      }
    });

    sendResponse(res, {
      success: true,
      message: "All users retrieved successfully",
      statusCode: StatusCodes.OK,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const getAllConversations = async (req, res, next) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    sendResponse(res, {
      success: true,
      message: "All conversations retrieved successfully",
      statusCode: StatusCodes.OK,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

const getConversationsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const conversations = await prisma.conversation.findMany({
      where: {
        userId: userId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    sendResponse(res, {
      success: true,
      message: "Conversations for user retrieved successfully",
      statusCode: StatusCodes.OK,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

const getAllMessages = async (req, res, next) => {
  try {
    let messages = await prisma.message.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        conversation: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    // Parse rowAiResponse for each message
    messages = messages.map(msg => {
      if (msg.rowAiResponse) {
        try {
          msg.rowAiResponse = JSON.parse(msg.rowAiResponse);
        } catch (e) {
          // Leave as string
        }
      }
      return msg;
    });

    sendResponse(res, {
      success: true,
      message: "All messages retrieved successfully",
      statusCode: StatusCodes.OK,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

const getAllMessagesByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    let messages = await prisma.message.findMany({
      where: {
        userId: userId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        conversation: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    // Parse rowAiResponse for each message
    messages = messages.map(msg => {
      if (msg.rowAiResponse) {
        try {
          msg.rowAiResponse = JSON.parse(msg.rowAiResponse);
        } catch (e) {
          // Leave as string
        }
      }
      return msg;
    });

    sendResponse(res, {
      success: true,
      message: "Messages for user retrieved successfully",
      statusCode: StatusCodes.OK,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

const getMessagesByConversationId = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    let messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    // Parse rowAiResponse for each message
    messages = messages.map(msg => {
      if (msg.rowAiResponse) {
        try {
          msg.rowAiResponse = JSON.parse(msg.rowAiResponse);
        } catch (e) {
          // Leave as string
        }
      }
      return msg;
    });

    sendResponse(res, {
      success: true,
      message: "Messages for conversation retrieved successfully",
      statusCode: StatusCodes.OK,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

const getAllAgentTrainings = async (req, res, next) => {
  try {
    const agentTrainings = await prisma.agentTraining.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    sendResponse(res, {
      success: true,
      message: "All agent trainings retrieved successfully",
      statusCode: StatusCodes.OK,
      data: agentTrainings,
    });
  } catch (error) {
    next(error);
  }
};

export const PublicApiController = {
  getAllUsers,
  getAllConversations,
  getConversationsByUserId,
  getAllMessages,
  getAllMessagesByUserId,
  getMessagesByConversationId,
  getAllAgentTrainings,
};
