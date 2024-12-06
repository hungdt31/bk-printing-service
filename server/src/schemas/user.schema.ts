import { z } from "zod";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(16),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(16),
  username: z.string().min(1),
  role: z.enum(["STUDENT", "LECTURER", "SPSO"]),
});

export const UpdateProfileSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(9).regex(phoneRegex, 'Invalid phone number'),
  dob: z.coerce.date(),
});
