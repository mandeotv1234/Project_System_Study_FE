import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import  API_DOMAIN  from "../../Utils/request"; // Đường dẫn tùy thuộc vào cấu trúc dự án của bạn
const StudentHome = () => {
  const navigate = useNavigate();

  // State để lưu danh sách khóa học
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [unregisteredCourses, setUnregisteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API để lấy danh sách khóa học
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        const response = await axios.get(`${API_DOMAIN}/api/courses/view`, {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        });
        const courses = response.data;

        // Kiểm tra trạng thái đăng ký cho từng khóa học
        const registered = [];
        const unregistered = [];

        for (const course of courses) {
          try {
            const enrollmentResponse = await axios.get(`${API_DOMAIN}/api/enrollments/${course.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (enrollmentResponse.data === true) {
              registered.push(course); // Đã đăng ký
            } else {
              unregistered.push(course); // Chưa đăng ký
            }
          } catch (error) {
            console.error(`Lỗi khi kiểm tra trạng thái đăng ký cho khóa học ${course.id}:`, error);
          }
        }

        setRegisteredCourses(registered);
        setUnregisteredCourses(unregistered);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách khóa học:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Xử lý khi bấm vào chi tiết khóa học
  const handleCourseDetail = (courseId, isRegistered) => {
    if (isRegistered) {
      navigate(`/course/${courseId}`, { state: { isRegistered: true } });
    } else {
      navigate(`/course/${courseId}`, { state: { isRegistered: false } });
    }
  };

  // Xử lý khi bấm vào nút "Đăng ký"
  const handleEnrollCourse = async (courseId) => {
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      const response = await axios.post(`${API_DOMAIN}/api/enrollments/${courseId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert("Đăng ký khóa học thành công!");
        navigate(`/course/${courseId}`, { state: { isRegistered: true } }); // Chuyển đến trang chi tiết khóa học
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký khóa học:", error);
      alert("Đăng ký khóa học thất bại. Vui lòng thử lại.");
    }
  };

  // Xử lý khi bấm vào nút "Chat"
  const handleChat = () => {
    navigate("/chat");
  };

  if (loading) {
    return <div className="text-center mt-5">Đang tải danh sách khóa học...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Trang Học sinh</h1>

      {/* Nút Chat */}
      <div className="text-end mb-4">
        <button className="btn btn-info" onClick={handleChat}>
          Chat
        </button>
      </div>

      {/* Khóa học đã đăng ký */}
      <div className="mb-5">
        <h3>Khóa học đã đăng ký</h3>
        <ul className="list-group">
          {registeredCourses.map((course) => (
            <li key={course.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5>{course.title}</h5>
                <p className="mb-0">{course.description}</p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => handleCourseDetail(course.id, true)}
              >
                Chi tiết
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Khóa học chưa đăng ký */}
      <div>
        <h3>Khóa học chưa đăng ký</h3>
        <ul className="list-group">
          {unregisteredCourses.map((course) => (
            <li key={course.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5>{course.title}</h5>
                <p className="mb-0">{course.description}</p>
              </div>
              <div>
                <button
                  className="btn btn-success me-2"
                  onClick={() => handleCourseDetail(course.id, false)}
                >
                  Chi tiết
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleEnrollCourse(course.id)}
                >
                  Đăng ký
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentHome;