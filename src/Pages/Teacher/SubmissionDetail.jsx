import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SubmissionDetail = () => {
  const { submissionId } = useParams(); // Lấy submissionId từ URL
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null); // Thông tin bài nộp
  const [grade, setGrade] = useState(""); // Điểm chấm
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissionDetail = async () => {
      try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage

        // Lấy thông tin chi tiết bài nộp
        const response = await axios.get(
          `http://localhost:8080/api/submissions/teacher/${submissionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSubmission(response.data);
        setGrade(response.data.grade || ""); // Nếu đã có điểm, hiển thị điểm
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết bài nộp:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissionDetail();
  }, [submissionId]);

  const handleGradeSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      // Gửi yêu cầu chấm điểm
      await axios.post(
        `http://localhost:8080/api/submissions/teacher/${submissionId}/grade`,
        null, // Không có body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: { grade }, // Gửi điểm qua query parameter
        }
      );

      alert("Chấm điểm thành công!");
      navigate(-1); // Quay lại trang trước
    } catch (error) {
      console.error("Lỗi khi chấm điểm:", error);
      alert("Chấm điểm thất bại. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Đang tải chi tiết bài nộp...</div>;
  }

  if (!submission) {
    return <div className="text-center mt-5">Không tìm thấy thông tin bài nộp.</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Chi tiết bài nộp</h1>
      <p><strong>URL bài nộp:</strong> <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">Tải xuống</a></p>
      <p><strong>Ghi chú:</strong> {submission.comments}</p>
      <p><strong>Thời gian nộp:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
      <p><strong>Điểm hiện tại:</strong> {submission.grade !== null ? submission.grade : "Chưa chấm"}</p>

      {/* Form chấm điểm */}
      <div className="mt-4">
        <label htmlFor="grade" className="form-label">Chấm điểm</label>
        <input
          type="number"
          id="grade"
          className="form-control"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          placeholder="Nhập điểm"
          required
        />
        <button className="btn btn-primary mt-3" onClick={handleGradeSubmit}>
          Lưu điểm
        </button>
      </div>
    </div>
  );
};

export default SubmissionDetail;