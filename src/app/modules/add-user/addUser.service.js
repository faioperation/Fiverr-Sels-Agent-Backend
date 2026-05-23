import prisma from "../../prisma/client.js";
import bcrypt from "bcrypt";
import { envVars } from "../../config/env.js";
import DevBuildError from "../../lib/DevBuildError.js";
import { StatusCodes } from "http-status-codes";

export const AddUserService = {
  create: async (data) => {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new DevBuildError("User with this email already exists", StatusCodes.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(
      data.password,
      Number(envVars.BCRYPT_SALT_ROUND || 10)
    );

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: hashedPassword,
        role: data.role || "USER",
        isVerified: true, // As requested
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      }
    });

    return user;
  },

  getAll: async () => {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      }
    });
  },

  getById: async (id) => {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      }
    });
  },

  update: async (id, data) => {
    const updateData = { ...data };
    if (updateData.password) {
      updateData.passwordHash = await bcrypt.hash(
        updateData.password,
        Number(envVars.BCRYPT_SALT_ROUND || 10)
      );
      delete updateData.password;
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        updatedAt: true,
      }
    });
  },

  delete: async (id) => {
    return prisma.user.delete({
      where: { id },
    });
  }
};
