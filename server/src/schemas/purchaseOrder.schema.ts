import { z } from "zod";
import { PurchaseStatus } from "@prisma/client";

export const PurchaseOrderSchema = z.object({
  amount: z.number().int().min(1, {
    message: "Amount must be greater than 0",
  }),
});

export const UpdatePurchaseOrderSchema = z.object({
  status: z.nativeEnum(PurchaseStatus),
});

// purchase_id  Int        @id @default(autoincrement())
//   time         DateTime   @default(now())
//   amount       Int        @default(0)
//   price        Float      @default(0)
//   status       PurchaseStatus @default(UNPAID)

//   user         User?      @relation("UserPurchaseOrders", fields: [user_id], references: [user_id])
//   user_id      Int?