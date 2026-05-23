import { z } from "zod";

const createConversationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Conversation name is required",
    }),
    type: z.enum(["GLOBAL", "SALES_BOT", "SERVICE_GUIDE", "ALTERNATIVE_GUIDE"]).optional().default("GLOBAL"),
    aiModel: z.enum(["GPT", "CLAUDE_HAIKU"]).optional().default("GPT"),
  }),
});

const updateConversationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    type: z.enum(["GLOBAL", "SALES_BOT", "SERVICE_GUIDE", "ALTERNATIVE_GUIDE"]).optional(),
    aiModel: z.enum(["GPT", "CLAUDE_HAIKU"]).optional(),
  }),
});

export const ConversationValidation = {
  createConversationSchema,
  updateConversationSchema,
};
