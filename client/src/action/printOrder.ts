import authorizedAxiosInstance from "@/lib/axios";
import { MultiplePaymentResponse, PrintOrderRequest, PrintOrderResponse } from "@/types/printOrder";
import { AxiosError } from "axios";
import { PurchaseSchema } from "@/schemas/Purchase";
import { z } from "zod";
import { purchase } from "./purchaseOrder";

export const paymentOrder = async (values: number[]) => {
  try {
    const result = await authorizedAxiosInstance.put<MultiplePaymentResponse>(
      "/print-orders/bulk-payment",
      { printOrderIds: values }
    );
    return {
      data: result.data.data,
      message: result.data.message,
    };
  } catch (error) {
    if (error instanceof AxiosError)
      return {
        data: null,
        message: error.response?.data.message,
      };
  };
  return {
    data: null,
    message: null,
  };
};

export const createOrder = async (values: PrintOrderRequest) => {
  try {
    const result = await authorizedAxiosInstance.post<PrintOrderResponse>(
      "/print-orders",
      values
    );
    return {
      data: result.data,
      message: result.data.message,
    };
  } catch (error) {
    if (error instanceof AxiosError)
      return {
        data: null,
        message: error.response?.data.message,
      };
  };
  return {
    data: null,
    message: null,
  };
}

export const cancelOrder = async (id: number) => {
  try {
    const result = await authorizedAxiosInstance.patch<PrintOrderResponse>(
      `/print-orders/${id}`
    );
    return {
      data: result.data,
      message: result.data.message,
    };
  } catch (error) {
    if (error instanceof AxiosError)
      return {
        data: null,
        message: error.response?.data.message,
      };
  };
  return {
    data: null,
    message: null,
  };
}

export const purchaseAndPayment = async ({
  purchasePayload,
  print_ids
} : {
  purchasePayload: z.infer<typeof PurchaseSchema>,
  print_ids: number[]
}) => {
  try {
    const rs = await purchase(purchasePayload);
    if (rs.data) {
      const result = await paymentOrder(print_ids);
      return {
        data: result.data,
        message: result.message,
      };
    } else {
      return {
        data: null,
        message: null,
      };
    }
  } catch (error) {
    if (error instanceof AxiosError)
      return {
        data: null,
        message: error.response?.data.message,
      };
  }
  return {
    data: null,
    message: null,
  };
}