export const ConversationService = {
  create: async (prisma, data) => {
    return prisma.conversation.create({
      data,
    });
  },

  findAllByUserId: async (prisma, userId) => {
    return prisma.conversation.findMany({
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
    return prisma.conversation.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });
  },

  update: async (prisma, id, userId, data) => {
    return prisma.conversation.update({
      where: {
        id,
        userId,
      },
      data,
    });
  },

  softDelete: async (prisma, id, userId) => {
    return prisma.conversation.update({
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
