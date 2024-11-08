import authorizedAxiosInstance from "@/lib/axios";
import { ProfileResponse } from "@/types/user";

export const getProfile = async () => {
  const result =
    await authorizedAxiosInstance.get<ProfileResponse>("/users/profile");
  return result.data.profile;
};
