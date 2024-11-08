import authorizedAxiosInstance from "@/lib/axios";
import { LogoutResponse } from "@/types/user";

export const handleLogout = async () => {
  try {
    const result =
      await authorizedAxiosInstance.delete<LogoutResponse>("/users/logout");
    return {
      data: result.data,
      message: result.data.message,
    };
  } catch (error) {
    return {
      data: null,
      message: null,
    };
  }
};
