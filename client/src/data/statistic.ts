import authorizedAxiosInstance from "@/lib/axios";
import { AdminStatisticResponse, StatisticResponse } from "@/types/statistic";

export const getStatistic = async () => {
  const response = await authorizedAxiosInstance.get<StatisticResponse>(`/statistic/me`);
  return response.data.data;
};

export const getAdminStatistic = async () => {
  const response = await authorizedAxiosInstance.get<AdminStatisticResponse>(`/statistic`);
  return response.data.data;
};
