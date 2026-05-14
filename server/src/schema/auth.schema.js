import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name min 3 chars"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password min 6 chars"),
  role: z.enum(["ADMIN", "USER"]).default("USER").optional(),
  phone: z.bigint().optional(),
  avatar: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});
