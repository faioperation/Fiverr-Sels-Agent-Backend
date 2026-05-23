import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../../utils/sendResponse.js";
import prisma from "../../../prisma/client.js";
import { AlternativeGuideService } from "./alternativeGuide.service.js";
import DevBuildError from "../../../lib/DevBuildError.js";

const createAlternativeGuide = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let { prompt, modelName, documentUrl, documentPath } = req.body;

    if (req.file) {
      documentPath = `uploads/${req.file.filename}`;
      documentUrl = `${req.protocol}://${req.get('host')}/${documentPath}`;
    }

    let result;
    const existing = await AlternativeGuideService.findFirstByUserId(prisma, userId);

    if (existing) {
      result = await AlternativeGuideService.update(prisma, existing.id, userId, {
        prompt,
        modelName,
        documentUrl,
        documentPath,
      });
    } else {
      result = await AlternativeGuideService.create(prisma, {
        userId,
        prompt,
        modelName,
        documentUrl,
        documentPath,
      });
    }

    sendResponse(res, {
      success: true,
      message: existing ? "Alternative Guide data updated successfully" : "Alternative Guide data created successfully",
      statusCode: existing ? StatusCodes.OK : StatusCodes.CREATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAlternativeGuides = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await AlternativeGuideService.findAllByUserId(prisma, userId);

    sendResponse(res, {
      success: true,
      message: "Alternative Guide data retrieved successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAlternativeGuideById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await AlternativeGuideService.findById(prisma, id, userId);

    if (!result) {
      throw new DevBuildError("Alternative Guide data not found", StatusCodes.NOT_FOUND);
    }

    sendResponse(res, {
      success: true,
      message: "Alternative Guide data retrieved successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateAlternativeGuide = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    let { prompt, modelName, documentUrl, documentPath } = req.body;

    if (req.file) {
      documentPath = `uploads/${req.file.filename}`;
      documentUrl = `${req.protocol}://${req.get('host')}/${documentPath}`;
    }

    const existing = await AlternativeGuideService.findById(prisma, id, userId);
    if (!existing) {
      throw new DevBuildError("Alternative Guide data not found", StatusCodes.NOT_FOUND);
    }

    const result = await AlternativeGuideService.update(prisma, id, userId, {
      prompt,
      modelName,
      documentUrl,
      documentPath,
    });

    sendResponse(res, {
      success: true,
      message: "Alternative Guide data updated successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAlternativeGuide = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const existing = await AlternativeGuideService.findById(prisma, id, userId);
    if (!existing) {
      throw new DevBuildError("Alternative Guide data not found", StatusCodes.NOT_FOUND);
    }

    await AlternativeGuideService.softDelete(prisma, id, userId);

    sendResponse(res, {
      success: true,
      message: "Alternative Guide data deleted successfully",
      statusCode: StatusCodes.OK,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const AlternativeGuideController = {
  createAlternativeGuide,
  getAlternativeGuides,
  getAlternativeGuideById,
  updateAlternativeGuide,
  deleteAlternativeGuide,
};
