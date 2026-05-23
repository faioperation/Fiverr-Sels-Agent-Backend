export const AgentTrainingService = {
  create: async (prisma, data) => {
    return prisma.agentTraining.create({
      data,
    });
  },

  findFirstByUserId: async (prisma, userId) => {
    return prisma.agentTraining.findFirst({
      where: {
        userId,
        deletedAt: null,
      },
    });
  },

  findAllByUserId: async (prisma, userId) => {
    return prisma.agentTraining.findMany({
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
    return prisma.agentTraining.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });
  },

  update: async (prisma, id, userId, data) => {
    return prisma.agentTraining.update({
      where: {
        id,
        userId,
      },
      data,
    });
  },

  softDelete: async (prisma, id, userId) => {
    return prisma.agentTraining.update({
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
