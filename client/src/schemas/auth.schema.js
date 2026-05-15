import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name min 3 chars"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password min 6 chars"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});
