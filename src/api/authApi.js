import axios, { AxiosHeaders } from 'axios';
import axiosClient from './axiosClient';

const authApi = {
  register: (params) => {
    const url = '/api/v1/user/register';
    return axiosClient
      .post(url, params)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
  },
  login: (params) => {
    const url = '/api/v1/user/login';
    return axiosClient
      .post(url, params)
      .then((response) => {
        if (response.data.code === 0) {
          // Lưu access_token vào Local Storage
          localStorage.setItem('access_token', response?.data?.accessToken);
        }
        // Trả về dữ liệu phản hồi cho phần gọi API
        return response;
      })
      .catch((error) => {
        return error.response.data;
      });
  },
  verifyOTP: (otp) => {
    const url = '/api/v1/user/verify-otp';

    return axiosClient.post(url, otp);
  },
  getOTP: (email) => {
    const url = '/api/v1/user/getOTP';
    return axiosClient.post(url, email);
  },
  resendOTP: (email) => {
    const url = '/api/v1/user/resendOTP';
    return axiosClient.post(url, email);
  },
  verifyOTPForgotPassword: (otp) => {
    const url = '/api/v1/user/verify-otp-forgotPass';

    return axiosClient.post(url, otp);
  },
  sendOTPForgotPassword: (params) => {
    const url = '/api/v1/user/send-otp-forgot-password';

    return axiosClient
      .post(url, params)
      .then((response) => {
        console.log(response);
        // Handle the response data as needed
        return response;
      })
      .catch((error) => {
        // Handle errors and throw or provide error information as needed
        return error.response.data;
      });
  },
  changePassword: (params) => {
    const url = '/api/v1/user/changePassword';

    const accessToken = localStorage.getItem('user-access-token');

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    return axiosClient
      .post(url, params, { headers })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response.data;
      });
  },
  addCourse: (params) => {
    const url = '/api/v1/course/add-course';
    return axiosClient.post(url, params);
  },
  updateCourse: (params) => {
    const url = '/api/v1/course/update-course';
    return axiosClient.post(url, params);
  },
  deleteCourse: (params) => {
    const url = '/api/v1/course/delete-course';
    return axiosClient.post(url, params);
  },
  findAllCourse: (params) => {
    const url = '/api/v1/course/find-all-course';
    return axiosClient.post(url, params);
  },
  addCategory: (params) => {
    const url = '/api/v1/category/add-category';
    return axiosClient.post(url, params);
  },
  updateCategory: (params) => {
    const url = '/api/v1/category/update-category';
    return axiosClient.post(url, params);
  },
  deleteCategory: (params) => {
    const url = '/api/v1/category/delete-category';
    return axiosClient.post(url, params);
  },
  findAllCategory: (params) => {
    const url = '/api/v1/category/find-all-category';
    return axiosClient.get(url, params);
  },
  findAllCourse: (params) => {
    const url = '/api/v1/course/find-all-course';
    return axiosClient.get(url, params);
  },
  addLesson: (params) => {
    const url = '/api/v1/lesson/add-lesson';
    return axiosClient.post(url, params);
  },
  updateLesson: (params) => {
    const url = '/api/v1/lesson/update-lesson';
    return axiosClient.put(url, params);
  },

  deleteLesson: (params) => {
    const url = '/api/v1/lesson/delete-lesson';
    return axiosClient.delete(url, { data: params });
  },

  findAllLesson: (params) => {
    const url = '/api/v1/lesson/find-all-lesson';
    return axiosClient.get(url, params);
  },

  updateQuiz: (params) => {
    const url = '/api/v1/quiz/update-quiz';
    return axiosClient.put(url, params);
  },

  addQuiz: (params) => {
    const url = '/api/v1/quiz/add-quiz';
    return axiosClient.post(url, params);
  },

  findAllQuiz: (params) => {
    const url = '/api/v1/quiz/find-all-quiz';
    return axiosClient.get(url, params);
  },
  deleteQuiz: (params) => {
    const url = '/api/v1/quiz/delete-quiz';
    return axiosClient.delete(url, { data: params });
  },

  updateQuestion: (params) => {
    const url = '/api/v1/question/update-question';
    return axiosClient.put(url, params);
  },

  addQuestion: (params) => {
    const url = '/api/v1/question/add-question';
    return axiosClient.post(url, params);
  },

  findAllQuestion: (params) => {
    const url = '/api/v1/question/find-all-question';
    return axiosClient.get(url, params);
  },
  deleteQuestion: (params) => {
    const url = '/api/v1/question/delete-question';
    return axiosClient.delete(url, { data: params });
  },

  updateAnswer: (params) => {
    const url = '/api/v1/answer/update-answer';
    return axiosClient.put(url, params);
  },

  addAnswer: (params) => {
    const url = '/api/v1/answer/add-answer';
    return axiosClient.post(url, params);
  },

  findAllAnswer: (params) => {
    const url = '/api/v1/answer/find-all-answer';
    return axiosClient.get(url, params);
  },
  deleteAnswer: (params) => {
    const url = '/api/v1/answer/delete-answer';
    return axiosClient.delete(url, { data: params });
  },
  getQuizById: (id) => {
    const url = `/api/v1/quiz/get-quiz-by-id?id=${id}`;
    return axiosClient.get(url);
  },
  getQuestionById: (id) => {
    const url = `/api/v1/question/get-question-by-id?id=${id}`;
    return axiosClient.get(url);
  },
  getAnswerById: (id) => {
    const url = `/api/v1/answer/get-answer-by-id?id=${id}`;
    return axiosClient.get(url);
  },
  getTotalCourse: (params) => {
    const url = '/api/v1/course/get-total-course';
    return axiosClient.get(url, params);
  },
  getTopCourse: (params) => {
    const url = '/api/v1/course/get-top-course';
    return axiosClient.get(url, params);
  },
  getNewestCourse: (params) => {
    const url = '/api/v1/course/get-newest-course';
    return axiosClient.get(url, params);
  },
  changeProfile: (params) => {
    const url = '/api/v1/user/change-profile';
    return axiosClient.put(url, params);
  },
  getUserByEmail: (params) => {
    const url = '/api/vi/user/get-user-by-email';
    return axiosClient.get(url, params);
  },
  getUserByUserName: (username) => {
    const url = `/api/v1/user/get-user-by-username?username=${username}`;
    return axiosClient.get(url);
  },
  getCourseById: (id) => {
    const url = `/api/v1/course/get-course-by-id?id=${id}`;
    return axiosClient.get(url);
  },
  getLessonByCourseId: (id) => {
    const url = `/api/v1/lesson/get-lessons-by-course?courseId=${id}`;
    return axiosClient.get(url);
  },
  enrollCourse: (params) => {
    const url = '/api/v1/course/enroll-course';
    return axiosClient.post(url, params);
  },
  confirmPayment: (params) => {
    const url = '/api/v1/course/confirm-payment';
    return axiosClient.post(url, params);
  },
  getCourseByUser: (username) => {
    const url = `/api/v1/course/get-course-user?username=${username}`;
    return axiosClient.get(url, username);
  },
  getLessonById: (id) => {
    const url = `/api/v1/lesson/get-lesson-by-id?id=${id}`;
    return axiosClient.get(url, id);
  },
  checkEnroll: (params) => {
    const url = `/api/v1/course/check-enroll?courseId=${params.courseId}&username=${params.username}`;
    return axiosClient.get(url, params);
  },
  totalCourse: (params) => {
    const url = '/api/v1/course/get-total-course';
    return axiosClient.get(url, params);
  },
  totalUser: (params) => {
    const url = '/api/v1/user/total-user';
    return axiosClient.get(url, params);
  },
  getQuestionByQuizId: (id) => {
    const url = `/api/v1/question/get-questions-by-quiz-id?quizId=${id}`;
    return axiosClient.get(url, id);
  },
  findAllDeleted: (str) => {
    const url = `/api/v1/${str}/find-all-${str}-by-deleted?deleted=${true}`;
    return axiosClient.get(url);
  },
  restoreEntity: (params, str) => {
    const url = `/api/v1/${str}/update-${str}`;
    if (str === 'category' || str === 'course') return axiosClient.post(url, params);
    else return axiosClient.put(url, params);
  },
  getAllUser: () => {
    const url = '/api/v1/user/get-all-user';
    return axiosClient.get(url);
  },
  getAnswerByQuestionId: (id) => {
    const url = `/api/v1/answer/get-answer-by-question-id?questionId=${id}`;
    return axiosClient.get(url, id);
  },
  changeRoleUser: (params) => {
    const url = '/api/v1/user/set-role-user';
    return axiosClient.post(url, params);
  },
  getUserByEmail: (email) => {
    const url = `/api/v1/user/get-user-by-email?email=${email}`;
    return axiosClient.get(url, email);
  },
  startQuiz: (id) => {
    const url = `/api/v1/quiz/start-quiz?quizId=${id}`;
    return axiosClient.get(url, id);
  },
  finishQuiz: (params) => {
    const url = '/api/v1/quiz/finish-quiz';
    return axiosClient.post(url, params);
  },
};

export default authApi;
