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
      '/api/v1/user/login',
      '/api/v1/user/register',
      '/api/v1/user/verify-otp',
      '/api/v1/user/verify-otp-forgotPass',
      '/api/v1/user/send-otp-forgot-password',
      '/api/v1/user/get-user-by-username',
      '/api-v1/user/get-user-by-email',

      '/api/v1/course/add-course',
      '/api/v1/course/update-course',
      '/api/v1/course/delete-course',
      '/api/v1/category/update-category',
      '/api/v1/category/add-category',
      '/api/v1/category/delete-category',
      '/api/v1/category/find-all-category',
      '/api/v1/course/find-all-course',
      '/api/v1/course/get-total-course',
      '/api/v1/course/get-top-course',
      '/api/v1/course/get-newest-course',
      '/api/v1/course/search-course',
      '/api/v1/course/enroll-course',
      '/api/v1/course/get-course-by-id',
      '/api/v1/course/confirm-payment',
      '/api/v1/course/get-course-user',

      '/api/v1/lesson/get-lessons-by-course',
      '/api/v1/lesson/add-lesson',
      '/api/v1/lesson/delete-lesson',
      '/api/v1/lesson/update-lesson',
      '/api/v1/lesson/find-all-lesson',

      '/api/v1/quiz/update-quiz',
      '/api/v1/quiz/add-quiz',
      '/api/v1/quiz/find-all-quiz',
      '/api/v1/quiz/delete-quiz',

      '/api/v1/question/update-question',
      '/api/v1/question/add-question',
      '/api/v1/question/find-all-question',
      '/api/v1/question/delete-question',
      '/api/v1/question/get-questions-by-quiz-id',

      '/api/v1/answer/update-answer',
      '/api/v1/answer/add-answer',
      '/api/v1/answer/find-all-answer',
      '/api/v1/answer/delete-answer',
      '/api/v1/quiz/get-quiz-by-id',
      '/api/v1/question/get-question-by-id',
      '/api/v1/answer/get-answer-by-id',
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
