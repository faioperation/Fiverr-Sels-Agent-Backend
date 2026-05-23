import { z } from "zod";

const createUserSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email"),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters"),
    role: z.enum(["SYSTEM_OWNER", "BUSINESS_OWNER", "STAFF", "USER", "CUSTOMER"]).optional(),
  }),
});

const updateUserSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    role: z.enum(["SYSTEM_OWNER", "BUSINESS_OWNER", "STAFF", "USER", "CUSTOMER"]).optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
  }),
});

export const AddUserValidation = {
  createUserSchema,
  updateUserSchema,
};
