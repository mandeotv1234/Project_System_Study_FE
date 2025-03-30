import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CourseDetail = () => {
  const { id } = useParams(); // Lấy courseId từ URL
  const navigate = useNavigate();
  const [course, setCourse] = useState(null); // Thông tin khóa học
  const [assignments, setAssignments] = useState([]); // Danh sách bài tập
  const [quizzes, setQuizzes] = useState([]); // Danh sách bài kiểm tra
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage

        // Lấy thông tin khóa học
        const courseResponse = await axios.get(`http://localhost:8080/api/courses/view/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourse(courseResponse.data);

        // Lấy danh sách bài tập
        const assignmentsResponse = await axios.get(
          `http://localhost:8080/api/assignments/course/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAssignments(assignmentsResponse.data);

        // Lấy danh sách bài kiểm tra
        const quizzesResponse = await axios.get(
          `http://localhost:8080/api/quizzes/course/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQuizzes(quizzesResponse.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết khóa học:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-5">Đang tải chi tiết khóa học...</div>;
  }

  if (!course) {
    return <div className="text-center mt-5">Không tìm thấy thông tin khóa học.</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">{course.title}</h1>
      <p><strong>Mô tả:</strong> {course.description}</p>
      <p><strong>Danh mục:</strong> {course.category}</p>
      <p><strong>Thời lượng:</strong> {course.duration}</p>
      <p><strong>Giá:</strong> {course.price ? `${course.price} VND` : "Miễn phí"}</p>
      <p><strong>Giảng viên:</strong> {course.teacher.username}</p>

      {/* Nút thêm bài tập và bài kiểm tra */}
      <div className="mb-4">
        <button
          className="btn btn-primary me-2"
          onClick={() => navigate(`/teacher/course/${id}/create-assignment`)}
        >
          Thêm bài tập
        </button>
        <button
          className="btn btn-success"
          onClick={() => navigate(`/teacher/course/${id}/create-quiz`)}
        >
          Thêm bài kiểm tra
        </button>
      </div>

      {/* Danh sách bài tập */}
      <h3 className="mt-4">Bài tập</h3>
      {assignments.length > 0 ? (
        <ul className="list-group">
          {assignments.map((assignment) => (
            <li key={assignment.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5>{assignment.title}</h5>
                <p>{assignment.description}</p>
              </div>
              <button
                className="btn btn-info"
                onClick={() => navigate(`/teacher/assignment/${assignment.id}`)}
              >
                Chi tiết
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có bài tập nào.</p>
      )}

      {/* Danh sách bài kiểm tra */}
      <h3 className="mt-4">Bài kiểm tra</h3>
      {quizzes.length > 0 ? (
        <ul className="list-group">
          {quizzes.map((quiz) => (
            <li key={quiz.id} className="list-group-item">
              <h5>{quiz.title}</h5>
              <p>{quiz.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có bài kiểm tra nào.</p>
      )}
    </div>
  );
};

export default CourseDetail;