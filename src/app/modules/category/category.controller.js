import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse.js";
import prisma from "../../prisma/client.js";
import { CategoryService } from "./category.service.js";
import DevBuildError from "../../lib/DevBuildError.js";

const createCategory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type } = req.body;

    const result = await CategoryService.create(prisma, {
      type,
      createdBy: userId,
    });

    sendResponse(res, {
      success: true,
      message: "Category created successfully",
      statusCode: StatusCodes.CREATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const result = await CategoryService.findAll(prisma);

    sendResponse(res, {
      success: true,
      message: "Categories retrieved successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await CategoryService.findById(prisma, id);

    if (!result) {
      throw new DevBuildError("Category not found", StatusCodes.NOT_FOUND);
    }

    sendResponse(res, {
      success: true,
      message: "Category retrieved successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    const existing = await CategoryService.findById(prisma, id);
    if (!existing) {
      throw new DevBuildError("Category not found", StatusCodes.NOT_FOUND);
    }

    const result = await CategoryService.update(prisma, id, { type });

    sendResponse(res, {
      success: true,
      message: "Category updated successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await CategoryService.findById(prisma, id);
    if (!existing) {
      throw new DevBuildError("Category not found", StatusCodes.NOT_FOUND);
    }

    await CategoryService.softDelete(prisma, id);

    sendResponse(res, {
      success: true,
      message: "Category deleted successfully",
      statusCode: StatusCodes.OK,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const CategoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
