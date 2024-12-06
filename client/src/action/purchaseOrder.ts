import authorizedAxiosInstance from "@/lib/axios";
import { PurchaseSchema } from "@/schemas/Purchase";
import { PurchaseOrderResponse } from "@/types/purchaseOrder";
import { z } from "zod";
import { AxiosError } from "axios";

export const purchaseOrder = async (data: z.infer<typeof PurchaseSchema>) => {
  const response = await authorizedAxiosInstance.post<PurchaseOrderResponse>("/purchase-orders", data);
  return response.data;
};

export const updatePurchaseOrder = async (purchaseId: number, status: "PAID" | "CANCELED" | "UNPAID") => {
  const response = await authorizedAxiosInstance.patch<PurchaseOrderResponse>(`/purchase-orders/${purchaseId}`, { status });
  return response.data;
};

export const purchase = async (data: z.infer<typeof PurchaseSchema>) => {
  try {
    const newPurchaseOrder = await purchaseOrder(data);
    if (newPurchaseOrder.data) {
      const updatedPurchaseOrder = await updatePurchaseOrder(newPurchaseOrder.data.purchase_id, "PAID");
      if (updatedPurchaseOrder) {
        return {
          data: updatedPurchaseOrder.data,
          message: updatedPurchaseOrder.message,
        };
      } else {
        return {
          data: null,
          message: null
        }
      }
    }
  } 
  catch (error) {
    if (error instanceof AxiosError) {
      return {
        data: null,
        message: error.response?.data.message,
      }
    }
  }
  return {
    data: null,
    message: null,
  };
};
