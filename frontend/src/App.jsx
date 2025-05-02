import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import ResetPassPage from "./pages/ResetPassPage";
import DashboardLayout from "./components/Layout";
import ProfilePage from "./pages/ProfilePage";
import ResultPage from "./pages/ResultPage";
import CoursePage from "./pages/CoursePage";
import StudentsPage from "./pages/StudentsPage";
import { useEffect } from "react";
import { getSemesters } from "./redux/actions/semesterActions";
import { useDispatch } from "react-redux";
import LecturerPage from "./pages/LecturerPage";
import LecturerDetailsPage from "./pages/LecturerDetailsPage";
import LecturerCoursesPage from "./pages/LecturerCoursesPage";
import LecturerCourseAssignPage from "./pages/LecturerCourseAssignPage";
import CourseListPage from "./pages/CourseListPage";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSemesters());
  }, [dispatch]);
  return (
    <Router>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/results' element={<ResultPage />} />
          <Route path='/students' element={<StudentsPage />} />
          <Route path='/lecturers' element={<LecturerPage />} />
          <Route path='/lecturers/:id' element={<LecturerDetailsPage />} />
          <Route
            path='/lecturers/:id/courses'
            element={<LecturerCoursesPage />}
          />
          <Route
            path='/lecturers/:id/assign-course'
            element={<LecturerCourseAssignPage />}
          />
          <Route path='/courses' element={<CourseListPage />} />
          <Route path='/courses/new' element={<CoursePage />} />
        </Route>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/reset-password' element={<ResetPassPage />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
