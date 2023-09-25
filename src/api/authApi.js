import axiosClient from './axiosClient';
const authApi = {
  register: (params) => {
    const url = '/api/v1/user/adduers';
    return axiosClient.post(url, params);
  },
  // login: (params) => {
  //   const url = 'api/v1/auth/login';
  //   return axiosClient.post(url, params).then((response) => {
  //     if (response.data.code === 0) {
  //       localStorage.setItem('access_token');
  //     }
  //   });
  // },
};

export default authApi;
