import { getProfile } from "@/data/user";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/constant";

export const useProfile = () => {
  return useQuery({
    queryKey: [queryKeys.profile],
    queryFn: getProfile,
    refetchOnMount: false, // không refetch khi component mount
    retry: false, // nếu không muốn retry khi có lỗi
    refetchInterval: 1000 * 60 * 60.5,
  });
};
