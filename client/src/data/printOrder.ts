import authorizedAxiosInstance from "@/lib/axios";
import { PrintOrderResponse } from "@/types/printOrder";

export const getHistoryPrintOrders = async () => {
  const result = await authorizedAxiosInstance.get<PrintOrderResponse>(
    "/print-orders/history"
  );
  return result.data.data;
};

export const getListPrintOrders = async () => {
  const result =
    await authorizedAxiosInstance.get<PrintOrderResponse>("/print-orders");
  return result.data.data;
};
