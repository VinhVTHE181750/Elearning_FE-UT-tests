import './App.css';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import SignIn from './pages/SignIn/SignIn';
import VerifyOtp from './pages/SignIn/VerifyOtp/VerifyOtp';
import ForgotPassword from './pages/SignIn/ForgotPassword/ForgotPassword';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import Profile from './pages/TotalPage/MyProfile/Profile';
import AllCourse from './pages/AllCourse/AllCourse';
import Course from './pages/Course/Course';
import { ColorModeContext, useMode } from './theme';
import { ThemeProvider } from '@mui/material';
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import ManageUser from './pages/Admin/ManageUser/ManageUser';
import ManageCourse from './pages/Admin/ManageCourse/ManageCourse';
import ManageCategory from './pages/Admin/ManageCategory/ManageCategory';
import ViewUser from './pages/Admin/ViewRequest';
import ViewCourse from './pages/TotalPage/ViewCourse';
import ViewQuiz from './pages/TotalPage/ViewQuiz';
import ViewAnswer from './pages/Admin/ViewRequest/ViewAnswer';
import AddCourse from './pages/TotalPage/AddRequest/AddCourse';
import AddCategory from './pages/TotalPage/AddRequest/AddCategory';
import AddLesson from './pages/TotalPage/AddRequest/AddLesson';
import AddAnswer from './pages/TotalPage/AddRequest/AddAnswer';
import AddQuiz from './pages/TotalPage/AddRequest/AddQuiz';
import AddQuestion from './pages/TotalPage/AddRequest/AddQuestion';
import EditUser from './pages/Admin/EditRequest';
import EditCourse from './pages/Admin/EditRequest/EditCourse';
import EditCategory from './pages/Admin/EditRequest/EditCategory';
import EditLesson from './pages/Admin/EditRequest/EditLesson';
import EditQuiz from './pages/Admin/EditRequest/EditQuiz';
import EditQuestion from './pages/Admin/EditRequest/EditQuestion';
import EditAnswer from './pages/Admin/EditRequest/EditAnswer';
import PaymentPage from './pages/PaymentPage/PaymentPage';
import MyLearning from './pages/MyLearning/MyLearning';
import Lesson from './pages/Lesson/Lesson';
import RecycleBin from './pages/Admin/RecycleBin/RecycleBin';
import PaymentVnPaySuccess from './pages/PaymentPage/PaymentVnPaySuccess';
import ManagePayment from './pages/Admin/ManagePayment/ManagePayment';
import MyPayment from './pages/PaymentPage/MyPayment';
import Blog from './pages/Blog/Blog';
import PageNotFound from './pages/PageNotFound/PageNotFound';
import { useEffect, useState } from 'react';
import MaintenancePage from './pages/MaintenancePage/MaintenancePage';
import Chatgpt from './pages/TotalPage/MyChatGPT/Chatgpt';
import TakeQuiz from './pages/Lesson/TakeQuiz/TakeQuiz';
import authApi from './api/authApi';

function PrivateOutlet() {
  const auth = localStorage.getItem('role');
  return auth === 'ADMIN' ? <Outlet /> : <Navigate to="/signin" />;
}

const useServerStatus = () => {
  const [isServerDown, setIsServerDown] = useState(false);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await authApi.findAllCourse();
        console.log(response);
        if (response.code !== 'ERR_NETWORK') {
          setIsServerDown(false);
        } else {
          setIsServerDown(true);
        }
      } catch (error) {
        console.error('Error checking server status:', error);
        setIsServerDown(true);
      }
    };

    checkServerStatus();
  }, []);

  return isServerDown;
};

function App() {
  const [theme, colorMode] = useMode();
  // const isServerDown = useServerStatus();
  const isServerDown = false;
  return (
    <div>
      {isServerDown ? (
        <>
          <MaintenancePage />
        </>
      ) : (
        <>
          <div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/verifyOtp" element={<VerifyOtp />} />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route path="/changePassword" element={<ChangePassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/allCourse" element={<AllCourse />} />
              <Route path="/view-course/:id" element={<Course />} />
              <Route path="/viewLesson/:id" element={<Lesson />} />
              <Route path="/payment/:courseId" element={<PaymentPage />} />
              <Route path="/myLearning" element={<MyLearning />} />
              <Route path="/paymentResult" element={<PaymentVnPaySuccess />} />
              <Route path="/myPayment" element={<MyPayment />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/chatgpt" element={<Chatgpt />} />
              <Route path="/takeQuiz/:quizId/:courseID/:lessonID/:session" element={<TakeQuiz />} />

              {/* <Route path="*" element={<PageNotFound />} /> */}
            </Routes>

            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <Routes>
                  {/* <Route element={<PrivateOutlet />}> */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/manageUser" element={<ManageUser />} />
                    <Route path="/manageCourse" element={<ManageCourse />} />
                    <Route path="/manageCategory" element={<ManageCategory />} />
                    <Route path="/managePayment" element={<ManagePayment />} />

                    <Route path="/view/:username" element={<ViewUser />} />
                    <Route path="/viewCourse/:courseID" element={<ViewCourse />} />
                    <Route path="/view-quiz/:quizID" element={<ViewQuiz />} />
                    <Route path="/view-answer/:quizID" element={<ViewAnswer />} />

                    <Route path="/add-course/" element={<AddCourse />} />
                    <Route path="/add-category" element={<AddCategory />} />
                    <Route path="/add-lesson/:courseID" element={<AddLesson />} />
                    <Route path="/add-answer" element={<AddAnswer />} />
                    <Route path="/add-quiz/:lessonID" element={<AddQuiz />} />
                    <Route path="/add-question/:quizID" element={<AddQuestion />} />

                    <Route path="/editUser/:userId" element={<EditUser />} />
                    <Route path="/editCourse/:courseID" element={<EditCourse />} />
                    <Route path="/editCategory/:categoryId" element={<EditCategory />} />
                    <Route path="/edit-lesson/:lessonID" element={<EditLesson />} />
                    <Route path="/edit-quiz/:quizID" element={<EditQuiz />} />
                    <Route path="/edit-question/:questionID" element={<EditQuestion />} />
                    <Route path="/edit-answer" element={<EditAnswer />} />

                    <Route path="/recycleBin" element={<RecycleBin />} />
                  {/* </Route> */}
                </Routes>
              </ThemeProvider>
            </ColorModeContext.Provider>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
