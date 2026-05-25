export const CategoryService = {
  create: async (prisma, data) => {
    return prisma.category.create({
      data,
    });
  },

  findAll: async (prisma) => {
    return prisma.category.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById: async (prisma, id) => {
    return prisma.category.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  },

  update: async (prisma, id, data) => {
    return prisma.category.update({
      where: { id },
      data,
    });
  },

  softDelete: async (prisma, id) => {
    return prisma.category.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};
