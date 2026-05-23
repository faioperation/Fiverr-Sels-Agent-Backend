import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse.js";
import { AddUserService } from "./addUser.service.js";

const createUser = async (req, res, next) => {
  try {
    const result = await AddUserService.create(req.body);
    sendResponse(res, {
      success: true,
      message: "User created successfully",
      statusCode: StatusCodes.CREATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const result = await AddUserService.getAll();
    sendResponse(res, {
      success: true,
      message: "Users retrieved successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const result = await AddUserService.getById(req.params.id);
    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "User not found" });
    }
    sendResponse(res, {
      success: true,
      message: "User retrieved successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const result = await AddUserService.update(req.params.id, req.body);
    sendResponse(res, {
      success: true,
      message: "User updated successfully",
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await AddUserService.delete(req.params.id);
    sendResponse(res, {
      success: true,
      message: "User deleted successfully",
      statusCode: StatusCodes.OK,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const AddUserController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
