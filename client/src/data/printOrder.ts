import authorizedAxiosInstance from "@/lib/axios";
import { PrintOrderResponse, PrintOrdersByAdminResponse } from "@/types/printOrder";

export const getHistoryPrintOrders = async (props : {
  status?: 'SUCCESS' | 'CANCELLED' | 'PENDING' | 'ALL',
  name?: string,
  time_start: Date,
  time_end: Date,
  printer_id?: number
}) => {
  const filteredProps = Object.fromEntries(
    Object.entries(props).filter(([_, value]) => value !== null && value !== undefined && value !== 'ALL' && value !== 0)
  );
  const result = await authorizedAxiosInstance.post<PrintOrderResponse>(
    "/print-orders/history/me",
    filteredProps
  );
  return result.data.data;
};

export const getListPrintOrders = async () => {
  const result =
    await authorizedAxiosInstance.get<PrintOrderResponse>("/print-orders");
  return result.data.data;
};

export const getPrintOrdersByAdmin = async (props : {
  status?: 'SUCCESS' | 'CANCELLED' | 'PENDING' | 'ALL',
  name?: string,
  time_start: Date,
  time_end: Date,
  printer_id?: number
}) => {
  // loại bỏ tất các giá trị null
  const filteredProps = Object.fromEntries(
    Object.entries(props).filter(([_, value]) => value !== null && value !== undefined && value !== 'ALL' && value !== 0)
  );
  // console.log('input đã duyệt: ', filteredProps)
  const result =
    await authorizedAxiosInstance.post<PrintOrdersByAdminResponse>("/print-orders/history", filteredProps);
  return result.data.data;
};
