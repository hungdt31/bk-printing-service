// Author: TrungQuanDev: https://youtube.com/@trungquandev
import axios from "axios";
// import toast from "react-hot-toast";
// import { toast } from "react-hot-toast";
// Khởi tạo đối tượng Axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án.
import { refreshToken } from "@/action/refreshtoken";
import { handleLogout } from "@/action/logout";
// import { toast } from "react-hot-toast";
const authorizedAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACK_END_URL,
});

// Thời gian chờ tối đa của 1 request là 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10;

// withCredentials: sẽ cho phép axios tự động đính kèm và gửi cookie trong mỗi request lên BE
// phục vụ trường hợp nếu chúng ta sử dụng JWT tokens (refresh và access) theo cơ chế httpOnly Cookie
authorizedAxiosInstance.defaults.withCredentials = true;

/**
 * Cấu hình Interceptors (Bộ đánh chặn vào giữa mọi Request và Response)
 * https://axios-http.com/docs/interceptors
 */

// Add a request interceptor: can thiệp vào giữa những request API
let refreshTokenPromise: Promise<void> | null = null;
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor: Can thiệp vào những response nhận về từ API
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log(response.data.message);
    return response;
  },
  async (error) => {
    // Nếu nhận 404 - NOT FOUND thì cần refresh lại token và tạo mới access token
    const originalRequest = error.config;
    // console.log("Original request: ", originalRequest);
    if (
      error.response?.status === 402 &&
      // !originalRequest._retry
      originalRequest
    ) {
      // Gán thêm một giá trị _retry luôn = true trong khoảng thời gian chờ, để việc refresh token này chỉ luôn gọi 1 lần tại 1 thời điểm
      originalRequest._retry = true;
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshToken()
          .then((
            // res
          ) => {
            // const { accessToken } = res.data;
            // console.log("New access token: ", accessToken);
          })
          .catch((_error) => {
            // Bất kỳ lỗi nào về refresh token cũng cần logout người dùng ra khỏi hệ thống
            handleLogout().then(() => {
              location.href = "/sign-in";
            });
            return Promise.reject(_error);
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }
      return refreshTokenPromise.then(() => {
        // Gọi lại request ban đầu sau khi đã refresh token thành công
        return authorizedAxiosInstance(originalRequest);
      });
    }
    if (error.response?.status !== 402) {
      // Nếu nhận 401 - Unauthorized thì cần logout người dùng ra khỏi hệ thống
      console.clear();
      // toast.error(error.response?.data?.message);
      console.log(
        `${error.response?.status} - ${error.response?.data?.message}`,
      );
    }
    return Promise.reject(error);
  },
);

export default authorizedAxiosInstance;
