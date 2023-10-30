import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import SignIn from './pages/SignIn/SignIn';
import VerifyOtp from './pages/SignIn/VerifyOtp/VerifyOtp';
import ForgotPassword from './pages/SignIn/ForgotPassword/ForgotPassword';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import Profile from './pages/Profile/Profile';
import AllCourse from './pages/AllCourse/AllCourse';
import Course from './pages/Course/Course';
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import Sidebar from './components/Sidebar/Sidebar';
import ManageUser from './pages/Admin/ManageUser/ManageUser';
import ManageCourse from './pages/Admin/ManageCourse/ManageCourse';
import ManageCategory from './pages/Admin/ManageCategory/ManageCategory';
import ViewUser from './pages/Admin/ViewRequest';
import ViewCourse from './pages/Admin/ViewRequest/ViewCourse';
import ViewQuiz from './pages/Admin/ViewRequest/ViewQuiz';
import ViewAnswer from './pages/Admin/ViewRequest/ViewAnswer';
import ViewLesson from './pages/Admin/ViewRequest/ViewLesson';
import AddCourse from './pages/Admin/AddRequest/AddCourse';
import AddCategory from './pages/Admin/AddRequest/AddCategory';
import AddLesson from './pages/Admin/AddRequest/AddLesson';
import AddAnswer from './pages/Admin/AddRequest/AddAnswer';
import AddQuiz from './pages/Admin/AddRequest/AddQuiz';
import AddQuestion from './pages/Admin/AddRequest/AddQuestion';
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

function App() {
  const [theme, colorMode] = useMode();

  return (
    <div className="App">
      {localStorage.getItem('role') === 'ADMIN' ? (
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="app" style={{ display: 'flex' }}>
              <Sidebar />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <main className="content">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/manageUser" element={<ManageUser />} />
                    <Route path="/manageCourse" element={<ManageCourse />} />
                    <Route path="/manageCategory" element={<ManageCategory />} />

                    <Route path="/view/:username" element={<ViewUser />} />
                    <Route path="/viewCourse/:courseID" element={<ViewCourse />} />
                    <Route path="/view-quiz/:quizID" element={<ViewQuiz />} />
                    <Route path="/view-answer/:quizID" element={<ViewAnswer />} />

                    <Route path="/add-course" element={<AddCourse />} />
                    <Route path="/add-category" element={<AddCategory />} />
                    <Route path="/add-lesson" element={<AddLesson />} />
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
                  </Routes>
                </main>
              </div>
            </div>
          </ThemeProvider>
        </ColorModeContext.Provider>
      ) : (
        <>
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
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/myLearning" element={<MyLearning />} />
            <Route path="/payment-result" element={<PaymentVnPaySuccess />} />
          </Routes>
        </>
      )}
    </div>
  );
}

export default App;
