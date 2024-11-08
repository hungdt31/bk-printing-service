import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(16),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(16),
  name: z.string().min(1),
});
