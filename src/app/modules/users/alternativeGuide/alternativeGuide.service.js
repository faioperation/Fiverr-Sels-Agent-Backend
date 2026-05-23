export const AlternativeGuideService = {
  create: async (prisma, data) => {
    return prisma.alternativeGuide.create({
      data,
    });
  },

  findFirstByUserId: async (prisma, userId) => {
    return prisma.alternativeGuide.findFirst({
      where: {
        userId,
        deletedAt: null,
      },
    });
  },

  findAllByUserId: async (prisma, userId) => {
    return prisma.alternativeGuide.findMany({
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
    return prisma.alternativeGuide.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });
  },

  update: async (prisma, id, userId, data) => {
    return prisma.alternativeGuide.update({
      where: {
        id,
        userId,
      },
      data,
    });
  },

  softDelete: async (prisma, id, userId) => {
    return prisma.alternativeGuide.update({
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
