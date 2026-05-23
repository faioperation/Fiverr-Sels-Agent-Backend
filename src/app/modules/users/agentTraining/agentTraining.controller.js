import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../../utils/sendResponse.js";
import prisma from "../../../prisma/client.js";
import { AgentTrainingService } from "./agentTraining.service.js";
import DevBuildError from "../../../lib/DevBuildError.js";

const createAgentTraining = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let { prompt, modelName, documentUrl, documentPath } = req.body;

    if (req.file) {
      documentPath = `uploads/${req.file.filename}`;
      documentUrl = `${req.protocol}://${req.get('host')}/${documentPath}`;
    }

    let result;
    const existing = await AgentTrainingService.findFirstByUserId(prisma, userId);

    if (existing) {
      result = await AgentTrainingService.update(prisma, existing.id, userId, {
        prompt,
        modelName,
        documentUrl,
        documentPath,
      });
    } else {
      result = await AgentTrainingService.create(prisma, {
        userId,
        prompt,
        modelName,
        documentUrl,
        documentPath,
      });
    }

    sendResponse(res, {
      success: true,
      message: existing ? "Agent training data updated successfully" : "Agent training data created successfully",
      statusCode: existing ? StatusCodes.OK : StatusCodes.CREATED,
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
    let { prompt, modelName, documentUrl, documentPath } = req.body;

    if (req.file) {
      documentPath = `uploads/${req.file.filename}`;
      documentUrl = `${req.protocol}://${req.get('host')}/${documentPath}`;
    }

    const existing = await AgentTrainingService.findById(prisma, id, userId);
    if (!existing) {
      throw new DevBuildError("Agent training data not found", StatusCodes.NOT_FOUND);
    }

    const result = await AgentTrainingService.update(prisma, id, userId, {
      prompt,
      modelName,
      documentUrl,
      documentPath,
    });

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
