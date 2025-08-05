import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Student/Home'
import Courses from '../pages/Student/Courses'
import Login from '../pages/Login'
import Register from '../pages/Register'
import './App.css'
import Test from '../pages/test'
import ProtectedRoute from '../components/ProtectedRoute'
import TeacherDashboard from '../pages/Teacher/dashboard'
import TeacherCourses from '../pages/Teacher/courses';
import AddCoursePage from '../pages/Teacher/AddCourse';
import TeacherCourse from '../pages/Teacher/course'
import CourseDetail from '../pages/Student/CourseDetail'
import Lesson from '../pages/Student/Lesson'
import Quiz from '../pages/Student/Quiz'
import Dashboard from '../pages/Dashboard'
import Users from '../pages/Users'
import CoursesCrud from '../pages/CoursesCrud'
import LessonsCrud from '../pages/LessonsCrud'
import EditCoursePage from '../pages/Teacher/course'
import AdminLogin from '../pages/admin-login'
import Unauthorized from '../pages/Unauthorized'
import EnrolledCourses from '../pages/Student/EnrolledCourses'
import StudentProfile from '../pages/Student/StudentProfile'
import TeacherProfile from '../pages/Student/TeacherProfile'
import Course from '../pages/Student/Course'
import CourseEnroll from '../pages/Student/CourseEnroll'
import PaymentSuccess from '../pages/Student/PaymentSuccess'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/admin/courses-crud" element={<ProtectedRoute><CoursesCrud /></ProtectedRoute>} />
        <Route path="/admin/lessons-crud" element={<ProtectedRoute><LessonsCrud /></ProtectedRoute>} />
        <Route path='/admin/login' element={<AdminLogin />} />


        <Route path='/teacher/dashboard' element={
          <ProtectedRoute>
            <TeacherDashboard/>
          </ProtectedRoute>
        }/>
        {/* <Route path='/teacher/profile' element={
          <ProtectedRoute><TeacherProfilePage/></ProtectedRoute>
        }/> */}
        <Route path='/teacher/addCourse' element={
          <ProtectedRoute>
            <AddCoursePage/>
          </ProtectedRoute>
        }/>
          <Route path="/teacher/course/:courseId" element={<ProtectedRoute>
            <EditCoursePage/>
          </ProtectedRoute>} />
          <Route path='/teacher/courses' element={<ProtectedRoute>
            <TeacherCourses/>
          </ProtectedRoute>}/>


        <Route path="/course" element={<Courses />} />
        <Route path="/courseOne/:tutorialId" element={<Course />} />
       {/*  <Route path="/course-enroll" element={<CourseEnroll />} /> */}
        <Route path="/student" element={<StudentProfile />} />
        <Route path="/teacher" element={<TeacherProfile />} />
        <Route path="/payment-success/:courseId" element={<PaymentSuccess />} />
        <Route
          path='/test'
          element={
            <ProtectedRoute>
              <Test />
            </ProtectedRoute>
          }
        />
        <Route path='/course_no' element={<Course />} />
        <Route path='/course_enroll/:courseId' element={<CourseEnroll />} />
        <Route path='/enrolled' element={<EnrolledCourses />} />
        <Route path='/unauthorized' element={<Unauthorized />} />
        <Route path="/course/:tutorialId" element={<CourseDetail />} />
        <Route path='/quiz/:tutorialId' element={<Quiz />} />
        <Route path="/lesson/:lessonId" element={<Lesson />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/teacher/course' element={<TeacherCourse/>}/>
      </Routes>
    </BrowserRouter>

  )
}

export default App
