import authorizedAxiosInstance from "@/lib/axios";
import { UpdateConfigResponse } from "@/types/config";
import { z } from "zod";
import { AxiosError } from "axios";
import { ConfigSchema } from "@/schemas/ConfigSchema";

export const updateConfig = async (data: z.infer<typeof ConfigSchema>) => {
  try {
    const response = await authorizedAxiosInstance.put<UpdateConfigResponse>("/config", data);
    return {
      data: response.data.data,
      message: response.data.message,
    }; 
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        data: null,
        message: error.response?.data.message,
      };
    }
  }
  return {
    data: null,
    message: null,
  }
};
