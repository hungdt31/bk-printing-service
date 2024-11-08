import authorizedAxiosInstance from "@/lib/axios";
import { LoginSchema } from "@/schemas/AuthSchema";
import { z } from "zod";
import { type LoginResponse } from "@/types/user";
import { AxiosError } from "axios";

export const hanldeLogin = async (values: z.infer<typeof LoginSchema>) => {
  const input = LoginSchema.safeParse(values);
  if (input.success) {
    try {
      const result = await authorizedAxiosInstance.post<LoginResponse>(
        "/users/login",
        values,
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
    }
  }
  return {
    data: null,
    message: null,
  };
};
