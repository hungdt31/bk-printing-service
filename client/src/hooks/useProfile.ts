import { getProfile } from "@/data/user";
import { useQuery } from "@tanstack/react-query";

export const userKey = {
  profile: ["profile"],
};

export const useProfile = () => {
  return useQuery({
    queryKey: userKey.profile,
    queryFn: getProfile,
    refetchOnMount: false, // không refetch khi component mount
    retry: false, // nếu không muốn retry khi có lỗi
    refetchInterval: 1000 * 60 * 60.5,
  });
};
