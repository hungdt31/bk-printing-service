import authorizedAxiosInstance from "@/lib/axios";
import { LogoutResponse } from "@/types/user";
import { AxiosError } from "axios";

export const handleLogout = async () => {
  try {
    const result =
      await authorizedAxiosInstance.delete<LogoutResponse>("/users/logout");
    return {
      data: result.data,
      message: result.data.message,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        data: null,
        message: error.response?.data.message
      }
    }
    return {
      data: null,
      message: null,
    };
  }
};
