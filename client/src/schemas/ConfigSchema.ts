import { z } from "zod";

export const ConfigSchema = z.object({
  DEFAULT_BALANCE: z.coerce.number().optional(),
  DATE_TO_UPDATE: z.string().optional(),
  PERMITTED_FILE_TYPES: z.array(z.string()).optional(),
  MAX_FILE_SIZE: z.coerce.number().min(1024).optional(),
  PRICE_PER_A4: z.coerce.number().optional(),
});


