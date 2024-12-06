import authorizedAxiosInstance from "@/lib/axios";
import { PurchaseOrderResponse } from "@/types/purchaseOrder";

interface PurchaseOrderPayload {
  sort: string;
  status: "PAID" | "UNPAID" | "CANCELED";
  skip: number;
  limit: number;
}
export const getPurchaseOrders = async ({ sort, status, skip, limit }: PurchaseOrderPayload) => {
  const response = await authorizedAxiosInstance.get<PurchaseOrderResponse>(`/purchase-orders?sort=${sort}&status=${status}&skip=${skip}&limit=${limit}`);
  return response.data.data;
};