import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse.js";
import prisma from "../../prisma/client.js";
import { AgentTrainingService } from "./agentTraining.service.js";
import DevBuildError from "../../lib/DevBuildError.js";

const createAgentTraining = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let { prompt, modelName, categoryId, documentUrls = [], documentPaths = [] } = req.body;

    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const docPath = `uploads/${file.filename}`;
        const docUrl = `${req.protocol}://${req.get('host')}/${docPath}`;
        documentPaths.push(docPath);
        documentUrls.push(docUrl);
      });
    }

    const result = await AgentTrainingService.create(prisma, {
      userId,
      categoryId,
      prompt,
      modelName,
      documentUrls,
      documentPaths,
    });

    sendResponse(res, {
      success: true,
      message: "Agent training data created successfully",
      statusCode: StatusCodes.CREATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAgentTrainings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await AgentTrainingService.findAllByUserId(prisma, userId);

    sendResponse(res, {
      success: true,
      message: "Agent training data retrieved successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAgentTrainingById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await AgentTrainingService.findById(prisma, id, userId);

    if (!result) {
      throw new DevBuildError("Agent training data not found", StatusCodes.NOT_FOUND);
    }

    sendResponse(res, {
      success: true,
      message: "Agent training data retrieved successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateAgentTraining = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    let { prompt, modelName, categoryId, documentUrls, documentPaths } = req.body;

    let updateData = {
      categoryId,
      prompt,
      modelName,
    };

    if (documentUrls !== undefined) {
      updateData.documentUrls = documentUrls;
    }
    if (documentPaths !== undefined) {
      updateData.documentPaths = documentPaths;
    }

    if (req.files && req.files.length > 0) {
      const newDocumentPaths = [];
      const newDocumentUrls = [];
      req.files.forEach(file => {
        const docPath = `uploads/${file.filename}`;
        const docUrl = `${req.protocol}://${req.get('host')}/${docPath}`;
        newDocumentPaths.push(docPath);
        newDocumentUrls.push(docUrl);
      });
      // If we are appending to existing ones or just replacing, typically we just append or use whatever the client sends.
      // If client didn't send existing arrays, we just use the new ones. If they did, we concat.
      updateData.documentPaths = [...(updateData.documentPaths || []), ...newDocumentPaths];
      updateData.documentUrls = [...(updateData.documentUrls || []), ...newDocumentUrls];
    }

    const existing = await AgentTrainingService.findById(prisma, id, userId);
    if (!existing) {
      throw new DevBuildError("Agent training data not found", StatusCodes.NOT_FOUND);
    }

    const result = await AgentTrainingService.update(prisma, id, userId, updateData);

    sendResponse(res, {
      success: true,
      message: "Agent training data updated successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAgentTraining = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const existing = await AgentTrainingService.findById(prisma, id, userId);
    if (!existing) {
      throw new DevBuildError("Agent training data not found", StatusCodes.NOT_FOUND);
    }

    await AgentTrainingService.softDelete(prisma, id, userId);

    sendResponse(res, {
      success: true,
      message: "Agent training data deleted successfully",
      statusCode: StatusCodes.OK,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const AgentTrainingController = {
  createAgentTraining,
  getAgentTrainings,
  getAgentTrainingById,
  updateAgentTraining,
  deleteAgentTraining,
};
