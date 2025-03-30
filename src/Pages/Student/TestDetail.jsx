import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Import thư viện jwt-decode
import  API_DOMAIN  from "../../Utils/request"; // Đường dẫn tùy thuộc vào cấu trúc dự án của bạn
const TestDetail = () => {
  const { id } = useParams(); // Lấy quizId từ URL
  const [quiz, setQuiz] = useState(null); // Thông tin bài kiểm tra
  const [questions, setQuestions] = useState([]); // Danh sách câu hỏi
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false); // Trạng thái bắt đầu bài kiểm tra
  const [answers, setAnswers] = useState({}); // Lưu câu trả lời của học sinh
  const [submissionResult, setSubmissionResult] = useState(null); // Kết quả nộp bài
  const [studentId, setStudentId] = useState(null); // Lưu studentId từ token

  // Giải mã token để lấy studentId
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Giải mã token
        console.log("Decoded Token:", decodedToken); // In ra payload của token
        setStudentId(decodedToken.id); // Lấy studentId từ payload của token
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
      }
    }
  }, []);

  // Gọi API để lấy thông tin bài kiểm tra và danh sách câu hỏi
  useEffect(() => {
    const fetchQuizDetail = async () => {
      try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage

        // Lấy thông tin bài kiểm tra
        const quizResponse = await axios.get(`${API_DOMAIN}/api/quizzes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        });
        setQuiz(quizResponse.data);

        // Lấy danh sách câu hỏi
        const questionsResponse = await axios.get(`${API_DOMAIN}/api/questions/quiz/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuestions(questionsResponse.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bài kiểm tra:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetail();
  }, [id]);

  const handleStartQuiz = () => {
    setStarted(true); // Cập nhật trạng thái bắt đầu bài kiểm tra
  };

  const handleAnswerChange = (questionId, chosenAnswer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: chosenAnswer,
    }));
  };

  const handleSubmitQuiz = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!studentId) {
        alert("Không tìm thấy thông tin sinh viên. Vui lòng đăng nhập lại.");
        return;
      }

      // Chuẩn bị dữ liệu gửi lên backend
      const submissionData = Object.keys(answers).map((questionId) => ({
        questionId: parseInt(questionId),
        chosenAnswer: answers[questionId],
      }));

      const response = await axios.post(
        `${API_DOMAIN}/api/quiz-submissions/${id}/submit/${studentId}`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSubmissionResult(response.data); // Lưu kết quả nộp bài
        alert("Nộp bài kiểm tra thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi nộp bài kiểm tra:", error);
      alert("Nộp bài kiểm tra thất bại. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Đang tải chi tiết bài kiểm tra...</div>;
  }

  if (!quiz) {
    return <div className="text-center mt-5">Không tìm thấy thông tin bài kiểm tra.</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">{quiz.title}</h1>
      <p><strong>Mô tả:</strong> {quiz.description}</p>
      <p><strong>Điểm tối đa:</strong> {quiz.maxScore}</p>

      {/* Nút bắt đầu bài kiểm tra */}
      {!started ? (
        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={handleStartQuiz}>
            Bắt đầu bài kiểm tra
          </button>
        </div>
      ) : (
        <>
          {/* Danh sách câu hỏi */}
          <h3 className="mt-4">Danh sách câu hỏi</h3>
          {questions.length > 0 ? (
            <ul className="list-group">
              {questions.map((question) => (
                <li key={question.id} className="list-group-item">
                  <p><strong>{question.content}</strong></p>
                  <div>
                    <label>
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value="A"
                        onChange={() => handleAnswerChange(question.id, "A")}
                      />{" "}
                      {question.optionA}
                    </label>
                  </div>
                  <div>
                    <label>
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value="B"
                        onChange={() => handleAnswerChange(question.id, "B")}
                      />{" "}
                      {question.optionB}
                    </label>
                  </div>
                  <div>
                    <label>
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value="C"
                        onChange={() => handleAnswerChange(question.id, "C")}
                      />{" "}
                      {question.optionC}
                    </label>
                  </div>
                  <div>
                    <label>
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value="D"
                        onChange={() => handleAnswerChange(question.id, "D")}
                      />{" "}
                      {question.optionD}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Không có câu hỏi nào.</p>
          )}

          {/* Nút nộp bài */}
          <div className="text-center mt-4">
            <button className="btn btn-success" onClick={handleSubmitQuiz}>
              Nộp bài kiểm tra
            </button>
          </div>

          {/* Hiển thị kết quả nộp bài */}
          {submissionResult && (
            <div className="alert alert-success mt-4" role="alert">
              <p><strong>Kết quả:</strong></p>
              <p>Điểm: {submissionResult.score}</p>
              <p>Thời gian nộp: {new Date(submissionResult.submittedAt).toLocaleString()}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TestDetail;