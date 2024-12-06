import { useQuery } from "@tanstack/react-query";
import { getStatistic, getAdminStatistic } from "@/data/statistic";
import { queryKeys } from "@/utils/constant";

export const useMyStatistic = () => {
  return useQuery({
    queryKey: [queryKeys.statistic],
    queryFn: getStatistic,
  });
};

export const useAdminStatistic = () => {
  return useQuery({
    queryKey: [queryKeys.adminStatistic],
    queryFn: getAdminStatistic,
  })
}
