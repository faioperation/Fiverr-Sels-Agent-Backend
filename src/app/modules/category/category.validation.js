import { z } from "zod";

const createCategorySchema = z.object({
  body: z.object({
    type: z.enum(["DM", "CMS", "AI", "MA"]),
  }),
});

const updateCategorySchema = z.object({
  body: z.object({
    type: z.enum(["DM", "CMS", "AI", "MA"]).optional(),
  }),
});

export const CategoryValidation = {
  createCategorySchema,
  updateCategorySchema,
};
