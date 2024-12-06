import {z} from 'zod';

export const PurchaseSchema = z.object({
  method: z.enum(['BANKING', 'MOMO', 'ZALOPAY']).default('BANKING'),
  amount: z.coerce.number().int().positive().default(1),
});