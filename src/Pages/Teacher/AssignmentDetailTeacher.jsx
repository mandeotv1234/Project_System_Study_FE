import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AssignmentDetailTeacher = () => {
  const { id } = useParams(); // Lấy assignmentId từ URL
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null); // Thông tin bài tập
  const [submissions, setSubmissions] = useState([]); // Danh sách bài nộp
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignmentDetail = async () => {
      try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage

        // Lấy thông tin chi tiết bài tập
        const assignmentResponse = await axios.get(
          `http://localhost:8080/api/assignments/course/detail/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAssignment(assignmentResponse.data);

        // Lấy danh sách bài nộp
        const submissionsResponse = await axios.get(
          `http://localhost:8080/api/submissions/assignment/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSubmissions(submissionsResponse.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết bài tập:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentDetail();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-5">Đang tải chi tiết bài tập...</div>;
  }

  if (!assignment) {
    return <div className="text-center mt-5">Không tìm thấy thông tin bài tập.</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">{assignment.title}</h1>
      <p><strong>Mô tả:</strong> {assignment.description}</p>
      <p><strong>Hạn nộp:</strong> {new Date(assignment.dueDate).toLocaleString()}</p>

      {/* Danh sách bài nộp */}
      <h3 className="mt-4">Danh sách bài nộp</h3>
      {submissions.length > 0 ? (
        <ul className="list-group">
          {submissions.map((submission) => (
            <li
              key={submission.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <p><strong>Sinh viên:</strong> {submission.studentName}</p>
                <p><strong>Thời gian nộp:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/teacher/assignment/${id}/submission/${submission.id}`)}
              >
                Xem chi tiết
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có bài nộp nào.</p>
      )}
    </div>
  );
};

export default AssignmentDetailTeacher;