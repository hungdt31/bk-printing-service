import authorizedAxiosInstance from "@/lib/axios";
export const refreshToken = async () => {
  return await authorizedAxiosInstance.put("/users/refresh-token");
};
