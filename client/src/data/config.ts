import authorizedAxiosInstance from "@/lib/axios";
import { ConfigResponse } from "@/types/config";
export const getConfig = async () => {
  const response = await authorizedAxiosInstance.get<ConfigResponse>(`/config`);
  return response.data.data;
};
