import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CourseList = () => {
  const [courses, setCourses] = useState([]); // Danh sách khóa học
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        const response = await axios.get("http://localhost:8080/api/courses/teacher", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách khóa học:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Đang tải danh sách khóa học...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Danh sách khóa học</h1>
      {courses.length > 0 ? (
        <ul className="list-group">
          {courses.map((course) => (
            <li
              key={course.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <h5>{course.title}</h5>
                <p>{course.description}</p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/teacher/course/${course.id}`)}
              >
                Xem chi tiết
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có khóa học nào.</p>
      )}
    </div>
  );
};

export default CourseList;