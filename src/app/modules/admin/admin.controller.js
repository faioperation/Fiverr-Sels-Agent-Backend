import { UserService } from "../user/user.service.js";
import prisma from "../../prisma/client.js";
import { Role } from "../../utils/role.js";

const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserService.findAllWithProfile(prisma);

    return res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await UserService.findByIdWithProfile(prisma, id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await UserService.findById(prisma, id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === Role.SYSTEM_OWNER) {
      return res.status(403).json({
        success: false,
        message: "System owner cannot be deleted",
      });
    }

    await UserService.delete(prisma, id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const AdminController = {
  getAllUsers,
  getSingleUser,
  deleteUser,
};
