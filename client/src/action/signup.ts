import authorizedAxiosInstance from "@/lib/axios";
import { SignUpSchema } from "@/schemas/AuthSchema";
import { z } from "zod";
import { type SignUpResponse } from "@/types/user";
import { AxiosError } from "axios";

export const hanldeSignUp = async (values: z.infer<typeof SignUpSchema>) => {
  const input = SignUpSchema.safeParse(values);
  if (input.success) {
    try {
      const result = await authorizedAxiosInstance.post<SignUpResponse>(
        "/users/register",
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
