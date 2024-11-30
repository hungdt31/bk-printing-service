import authorizedAxiosInstance from "@/lib/axios";
import { PrinterArrayResponse } from "@/types/printer";

export const getPrinters = async () => {
  const response = await authorizedAxiosInstance.get<PrinterArrayResponse>("/printers");
  return response.data.data;
};
