import { userSchema } from "@/schemas/UserSchema";
import authorizedAxiosInstance from "@/lib/axios";
import { UpdateProfileResponse } from "@/types/user";
import { z } from "zod";
import { AxiosError } from "axios";

export const updateProfile = async (data: z.infer<typeof userSchema>) => {
  try {
    const response = await authorizedAxiosInstance.patch<UpdateProfileResponse>("/users", data);
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
