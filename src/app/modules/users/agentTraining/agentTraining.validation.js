import { z } from "zod";

const createAgentTrainingSchema = z.object({
  body: z.object({
    prompt: z.string({
      required_error: "Prompt is required",
    }),
    modelName: z.enum(["GPT", "CLAUDE_HAIKU"]).optional(),
    documentUrl: z.string().url().optional().or(z.literal("")),
    documentPath: z.string().optional().or(z.literal("")),
  }),
});

const updateAgentTrainingSchema = z.object({
  body: z.object({
    prompt: z.string().optional(),
    modelName: z.enum(["GPT", "CLAUDE_HAIKU"]).optional(),
    documentUrl: z.string().url().optional().or(z.literal("")),
    documentPath: z.string().optional().or(z.literal("")),
  }),
});

export const AgentTrainingValidation = {
  createAgentTrainingSchema,
  updateAgentTrainingSchema,
};
