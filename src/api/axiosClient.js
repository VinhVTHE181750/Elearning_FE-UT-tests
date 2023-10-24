import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const axiosClient = axios.create({
  withCredentials: false,
  baseURL: 'http://localhost:8888',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  function (config) {
    if (config?.headers == null) {
      throw new Error(`Expected 'config' and 'config.headers' not to be undefined`);
    }
    const url = config.url !== undefined ? config.url : '';
    const urlNoAuth = [
      '/api/v1/user/register',
      '/api/v1/user/login',
      '/api/v1/user/verify-otp',
      '/api/v1/user/forgotPassword',
      '/api/v1/user/send-otp-forgot-password',
      '/api/v1/user/verify-otp-forgotPass',
      '/api/v1/user/getOTP',
      '/api/v1/user/resendOTP',
      '/api/v1/course/get-total-course',
      '/api/v1/course/get-top-course',
      '/api/v1/course/get-newest-course',
      '/api/v1/category/find-all-category',
    ];

    if (!isExistedUrl(urlNoAuth, url)) {
      config.headers.Authorization = `Bearer ${localStorage.getItem('user-access-token')}`;
    }
    return config;
  },
  async function (error) {
    return await Promise.reject(error);
  },
);

const isExistedUrl = (array, url) => {
  console.log(url);
  for (let data in array) {
    if (url.search(data) !== -1) {
      return true;
    }
  }

  return false;
};

axiosClient.interceptors.response.use(
  function (response) {
    return response.data;
  },
  async function (err) {
    const config = err.config;
    if (err.response != null && err.response.status === 401) {
      config._retry = true;
      try {
        const refreshToken = localStorage.getItem('user_refreshToken') || '';
        if (refreshToken !== '') {
          // refreshTokenTokenApi({ refreshToken })
          //   .then((response) => {
          //     localStorage.setItem('user_accessToken', response.data?.token || '');
          //     localStorage.setItem('user_refreshToken', response.data?.refreshToken || '');
          //   })
          //   .catch((status) => {
          //     if (status === 401) {
          //       console.log(err);
          //     }
          //   });
          // return await axios(err.response.config);
        }
      } catch (err) {
        return await Promise.reject(err);
      }
    }
    return await Promise.reject(err);
  },
);
export default axiosClient;
