import { getConfig } from "@/data/config";
import { queryKeys } from "@/utils/constant";
import { useQuery } from "@tanstack/react-query";

export const useGetConfig = () => {
  return useQuery({
    queryKey: [queryKeys.config],
    queryFn: getConfig,
  });
};
