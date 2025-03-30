import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import  API_DOMAIN  from "../../Utils/request"; // Đường dẫn tùy thuộc vào cấu trúc dự án của bạn
const AssignmentDetail = () => {
  const { id } = useParams(); // Lấy assignmentId từ URL
  const [assignment, setAssignment] = useState(null);
  const [fileUrl, setFileUrl] = useState(""); // URL của file nộp bài
  const [comments, setComments] = useState(""); // Ghi chú của sinh viên
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false); // Trạng thái nộp bài

  // Gọi API để lấy thông tin chi tiết bài tập
  useEffect(() => {
    const fetchAssignmentDetail = async () => {
      try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        const response = await axios.get(`${API_DOMAIN}/api/assignments/course/detail/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        });
        setAssignment(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết bài tập:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentDetail();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileUrl) {
      alert("Vui lòng nhập URL của file trước khi nộp!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const submissionData = {
        fileUrl,
        comments,
        assignmentId: id, // ID của bài tập
      };

      const response = await axios.post(
        `${API_DOMAIN}/api/submissions/submit`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Nộp bài tập thành công!");
        setSubmitted(true); // Cập nhật trạng thái nộp bài thành công
      }
    } catch (error) {
      console.error("Lỗi khi nộp bài tập:", error);
      alert("Nộp bài tập thất bại. Vui lòng thử lại.");
    }
  };

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

      {/* Hiển thị thông báo nếu đã nộp bài thành công */}
      {submitted ? (
        <div className="alert alert-success" role="alert">
          Bạn đã nộp bài tập thành công!
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="fileUrl" className="form-label">
              URL của file nộp bài:
            </label>
            <input
              type="text"
              id="fileUrl"
              className="form-control"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="Nhập URL của file"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="comments" className="form-label">
              Ghi chú:
            </label>
            <textarea
              id="comments"
              className="form-control"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Nhập ghi chú (nếu có)"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Nộp bài
          </button>
        </form>
      )}
    </div>
  );
};

export default AssignmentDetail;