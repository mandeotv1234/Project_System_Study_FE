import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Auth/Login";
import StudentHome from "./Pages/Student/StudentHome";
import TeacherHome from "./Pages/Teacher/TeacherHome";
import Unauthorized from "./Pages/Unauthorized";
import PrivateRoute from "./Routes/PrivateRoute";
import CourseDetail from "./Pages/Student/CourseDetail";
import AssignmentDetail from "./Pages/Student/AssignmentDetail";
import AssignmentDetailTeacher from "./Pages/Teacher/AssignmentDetailTeacher";
import LectureDetail from "./Pages/Student/LectureDetail";
import TestDetail from "./Pages/Student/TestDetail";
import CreateCourse from "./Pages/Teacher/CreateCourse";
import ProvideLecture from "./Pages/Teacher/ProvideLecture";
import CreateAssignment from "./Pages/Teacher/CreateAssignment";
import GradeAssignment from "./Pages/Teacher/GradeAssignment";
import CreateTest from "./Pages/Teacher/CreateTest";
import Layout from "./LayoutDefaut/Layout";
import CourseList from "./Pages/Teacher/CourseList";
import CourseDetailTeacher from "./Pages/Teacher/CourseDetail";
import SubmissionDetail from "./Pages/Teacher/SubmissionDetail";
import ChatBox from "./Chat/ChatBox"; // Đổi tên import để rõ ràng hơn
import AdminChatPage from "./Chat/AdminChatPage"; // Import trang chat của admin

function App() {
    return (
        <>
            {/* ChatBox luôn hiển thị */}
            <ChatBox />

            {/* Các Route */}
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    {/* Route chỉ dành cho Student */}
                    <Route element={<PrivateRoute allowedRoles={["STUDENT"]} />}>
                        <Route path="/student-dashboard" element={<StudentHome />} />
                        <Route path="/course/:id" element={<CourseDetail />} />
                        <Route path="/assignment/:id" element={<AssignmentDetail />} />
                        <Route path="/lecture/:id" element={<LectureDetail />} />
                        <Route path="/test/:id" element={<TestDetail />} />
                    </Route>

                    {/* Route chỉ dành cho Teacher */}
                    <Route element={<PrivateRoute allowedRoles={["TEACHER"]} />}>
                        <Route path="/teacher-dashboard" element={<TeacherHome />} />
                        <Route path="/teacher/create-course" element={<CreateCourse />} />
                        <Route path="/teacher/provide-lecture" element={<ProvideLecture />} />
                        <Route path="/teacher/course/:id/create-assignment" element={<CreateAssignment />} />
                        <Route path="/teacher/grade-assignment" element={<GradeAssignment />} />
                        <Route path="/teacher/course/:id/create-quiz" element={<CreateTest />} />
                        <Route path="/teacher/courses" element={<CourseList />} />
                        <Route path="/teacher/assignment/:id" element={<AssignmentDetailTeacher />} />
                        <Route path="/teacher/assignment/:id/submission/:submissionId" element={<SubmissionDetail />} />
                        <Route path="/teacher/course/:id" element={<CourseDetailTeacher />} />
                    </Route>

                      {/* Route chỉ dành cho Admin */}
                      <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
                        <Route path="/admin/chat" element={<AdminChatPage />} />
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;