import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../../utils/sendResponse.js";
import prisma from "../../../prisma/client.js";
import { ServiceGuideService } from "./serviceGuide.service.js";
import DevBuildError from "../../../lib/DevBuildError.js";

const createServiceGuide = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let { prompt, modelName, documentUrl, documentPath } = req.body;

    if (req.file) {
      documentPath = `uploads/${req.file.filename}`;
      documentUrl = `${req.protocol}://${req.get('host')}/${documentPath}`;
    }

    let result;
    const existing = await ServiceGuideService.findFirstByUserId(prisma, userId);

    if (existing) {
      result = await ServiceGuideService.update(prisma, existing.id, userId, {
        prompt,
        modelName,
        documentUrl,
        documentPath,
      });
    } else {
      result = await ServiceGuideService.create(prisma, {
        userId,
        prompt,
        modelName,
        documentUrl,
        documentPath,
      });
    }

    sendResponse(res, {
      success: true,
      message: existing ? "Service Guide data updated successfully" : "Service Guide data created successfully",
      statusCode: existing ? StatusCodes.OK : StatusCodes.CREATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getServiceGuides = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await ServiceGuideService.findAllByUserId(prisma, userId);

    sendResponse(res, {
      success: true,
      message: "Service Guide data retrieved successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getServiceGuideById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await ServiceGuideService.findById(prisma, id, userId);

    if (!result) {
      throw new DevBuildError("Service Guide data not found", StatusCodes.NOT_FOUND);
    }

    sendResponse(res, {
      success: true,
      message: "Service Guide data retrieved successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateServiceGuide = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    let { prompt, modelName, documentUrl, documentPath } = req.body;

    if (req.file) {
      documentPath = `uploads/${req.file.filename}`;
      documentUrl = `${req.protocol}://${req.get('host')}/${documentPath}`;
    }

    const existing = await ServiceGuideService.findById(prisma, id, userId);
    if (!existing) {
      throw new DevBuildError("Service Guide data not found", StatusCodes.NOT_FOUND);
    }

    const result = await ServiceGuideService.update(prisma, id, userId, {
      prompt,
      modelName,
      documentUrl,
      documentPath,
    });

    sendResponse(res, {
      success: true,
      message: "Service Guide data updated successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteServiceGuide = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const existing = await ServiceGuideService.findById(prisma, id, userId);
    if (!existing) {
      throw new DevBuildError("Service Guide data not found", StatusCodes.NOT_FOUND);
    }

    await ServiceGuideService.softDelete(prisma, id, userId);

    sendResponse(res, {
      success: true,
      message: "Service Guide data deleted successfully",
      statusCode: StatusCodes.OK,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const ServiceGuideController = {
  createServiceGuide,
  getServiceGuides,
  getServiceGuideById,
  updateServiceGuide,
  deleteServiceGuide,
};
