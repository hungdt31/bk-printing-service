import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("This is not a valid email."),
  password: z.string().min(4).max(16),
});

export const SignUpSchema = z.object({
  username: z.string().min(1),
  email: z.string().email("This is not a valid email."),
  password: z.string().min(4).max(16),
  role: z.string().optional(),
});
