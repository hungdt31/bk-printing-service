import { z } from "zod";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const userSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(9).regex(phoneRegex, 'Invalid phone number'),
  dob: z.coerce.date(),
});
