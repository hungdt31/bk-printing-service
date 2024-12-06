import authorizedAxiosInstance from "@/lib/axios";
import { GenerateReportResponse } from "@/types/report";

export const generateReport = async ({
  year, month
}: {
  year: number;
  month?: number;
}) => {
  const result = await authorizedAxiosInstance.get<GenerateReportResponse>(`/reports?year=${year}${month ? `&month=${month}` : ""}`);
  return result.data.data;
}