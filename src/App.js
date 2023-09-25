import { Routes, Route, Link, Switch } from 'react-router-dom';

import ForgetPass from './components/Login/ForgetPass';
import CourseList from './components/MyCourse/CourseList';
import CourseDetail from './components/MyCourse/CourseDetail';
import Login from './components/Login/Login';
import Home from './components/HomePage/Home';
import Profile from './components/Profile/profile';
import ChangePassword from './components/Login/ChangePassword';
// import EmailVerification from './components/Login/EmailVerification';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget" element={<ForgetPass />} />
        <Route path="/change" element={<ChangePassword />} />

        <Route path="/courseslist" element={<CourseList />} />
        <Route path="/courses" element={<CourseDetail />} />
      </Routes>
    </div>
  );
}

export default App;
