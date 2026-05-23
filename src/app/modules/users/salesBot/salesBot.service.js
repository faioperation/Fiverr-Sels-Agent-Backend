export const SalesBotService = {
  create: async (prisma, data) => {
    return prisma.salesBot.create({
      data,
    });
  },

  findFirstByUserId: async (prisma, userId) => {
    return prisma.salesBot.findFirst({
      where: {
        userId,
        deletedAt: null,
      },
    });
  },

  findAllByUserId: async (prisma, userId) => {
    return prisma.salesBot.findMany({
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
    return prisma.salesBot.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });
  },

  update: async (prisma, id, userId, data) => {
    return prisma.salesBot.update({
      where: {
        id,
        userId,
      },
      data,
    });
  },

  softDelete: async (prisma, id, userId) => {
    return prisma.salesBot.update({
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
