export const ServiceGuideService = {
  create: async (prisma, data) => {
    return prisma.serviceGuide.create({
      data,
    });
  },

  findFirstByUserId: async (prisma, userId) => {
    return prisma.serviceGuide.findFirst({
      where: {
        userId,
        deletedAt: null,
      },
    });
  },

  findAllByUserId: async (prisma, userId) => {
    return prisma.serviceGuide.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById: async (prisma, id, userId) => {
    return prisma.serviceGuide.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });
  },

  update: async (prisma, id, userId, data) => {
    return prisma.serviceGuide.update({
      where: {
        id,
        userId,
      },
      data,
    });
  },

  softDelete: async (prisma, id, userId) => {
    return prisma.serviceGuide.update({
      where: {
        id,
        userId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};
