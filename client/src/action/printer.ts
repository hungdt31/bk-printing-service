import authorizedAxiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { printerSchema, newPrinterSchema } from "@/schemas/PrinterSchema";
import { z } from "zod";

export const updatePrinter = async (printer_id: number, data: z.infer<typeof printerSchema>) => {
  try {   
    const response = await authorizedAxiosInstance.put(`/printers/${printer_id}`, data);
    return {
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        data: null,
        message: error.response?.data.message
      }
    }
  }
  return {
    data: null,
    message: "Something went wrong"
  }
}

export const createPrinter = async (data: z.infer<typeof newPrinterSchema>) => {
  try {
    const response = await authorizedAxiosInstance.post(`/printers`, data);
    return {
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        data: null,
        message: error.response?.data.message
      }
    }
  }
  return {
    data: null,
    message: "Something went wrong"
  }
}

export const deletePrinter = async (printer_ids: number[]) => {
  try {
    const response = await authorizedAxiosInstance.delete(`/printers`, { data: { printer_ids } });
    return {
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        data: null,
        message: error.response?.data.message
      }
    }
  }
  return {
    data: null,
    message: "Something went wrong"
  }
}