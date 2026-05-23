import { z } from "zod";

const createMessageSchema = z.object({
  body: z.object({
    conversationId: z.string({
      required_error: "Conversation ID is required",
    }),
    userQuery: z.string({
      required_error: "User query is required",
    }),
    role: z.enum(["USER", "AGENT"]).optional(),
    rowAiResponse: z.string().optional().or(z.literal("")),
    documentUrl: z.string().url().optional().or(z.literal("")),
    documentPath: z.string().optional().or(z.literal("")),
  }),
});                                    

const updateMessageSchema = z.object({
  body: z.object({
    userQuery: z.string().optional(),
    role: z.enum(["USER", "AGENT"]).optional(),
    rowAiResponse: z.string().optional().or(z.literal("")),
    documentUrl: z.string().url().optional().or(z.literal("")),
    documentPath: z.string().optional().or(z.literal("")),
  }),
});

export const MessageValidation = {
  createMessageSchema,
  updateMessageSchema,
};
