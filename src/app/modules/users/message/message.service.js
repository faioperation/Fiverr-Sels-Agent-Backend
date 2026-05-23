export const MessageService = {
  create: async (prisma, data) => {
    return prisma.message.create({
      data,
    });
  },

  findAllByConversationId: async (prisma, conversationId, userId) => {
    return prisma.message.findMany({
      where: {
        conversationId,
        userId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  findById: async (prisma, id, userId) => {
    return prisma.message.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });
  },

  update: async (prisma, id, userId, data) => {
    return prisma.message.update({
      where: {
        id,
        userId,
      },
      data,
    });
  },

  softDelete: async (prisma, id, userId) => {
    return prisma.message.update({
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
