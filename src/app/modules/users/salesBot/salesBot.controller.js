import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../../utils/sendResponse.js";
import prisma from "../../../prisma/client.js";
import { SalesBotService } from "./salesBot.service.js";
import DevBuildError from "../../../lib/DevBuildError.js";

const createSalesBot = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let { prompt, modelName, documentUrl, documentPath } = req.body;

    if (req.file) {
      documentPath = `uploads/${req.file.filename}`;
      documentUrl = `${req.protocol}://${req.get('host')}/${documentPath}`;
    }

    let result;
    const existing = await SalesBotService.findFirstByUserId(prisma, userId);

    if (existing) {
      result = await SalesBotService.update(prisma, existing.id, userId, {
        prompt,
        modelName,
        documentUrl,
        documentPath,
      });
    } else {
      result = await SalesBotService.create(prisma, {
        userId,
        prompt,
        modelName,
        documentUrl,
        documentPath,
      });
    }

    sendResponse(res, {
      success: true,
      message: existing ? "Sales Bot data updated successfully" : "Sales Bot data created successfully",
      statusCode: existing ? StatusCodes.OK : StatusCodes.CREATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSalesBots = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await SalesBotService.findAllByUserId(prisma, userId);

    sendResponse(res, {
      success: true,
      message: "Sales Bot data retrieved successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSalesBotById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await SalesBotService.findById(prisma, id, userId);

    if (!result) {
      throw new DevBuildError("Sales Bot data not found", StatusCodes.NOT_FOUND);
    }

    sendResponse(res, {
      success: true,
      message: "Sales Bot data retrieved successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateSalesBot = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    let { prompt, modelName, documentUrl, documentPath } = req.body;

    if (req.file) {
      documentPath = `uploads/${req.file.filename}`;
      documentUrl = `${req.protocol}://${req.get('host')}/${documentPath}`;
    }

    const existing = await SalesBotService.findById(prisma, id, userId);
    if (!existing) {
      throw new DevBuildError("Sales Bot data not found", StatusCodes.NOT_FOUND);
    }

    const result = await SalesBotService.update(prisma, id, userId, {
      prompt,
      modelName,
      documentUrl,
      documentPath,
    });

    sendResponse(res, {
      success: true,
      message: "Sales Bot data updated successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSalesBot = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const existing = await SalesBotService.findById(prisma, id, userId);
    if (!existing) {
      throw new DevBuildError("Sales Bot data not found", StatusCodes.NOT_FOUND);
    }

    await SalesBotService.softDelete(prisma, id, userId);

    sendResponse(res, {
      success: true,
      message: "Sales Bot data deleted successfully",
      statusCode: StatusCodes.OK,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const SalesBotController = {
  createSalesBot,
  getSalesBots,
  getSalesBotById,
  updateSalesBot,
  deleteSalesBot,
};
