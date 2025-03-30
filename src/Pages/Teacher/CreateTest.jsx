import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CreateTest = () => {
  const { id } = useParams(); // Lấy courseId từ URL
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [questions, setQuestions] = useState([
    { content: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "" },
  ]);
  const [quizId, setQuizId] = useState(null); // Lưu quizId sau khi tạo bài kiểm tra

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { content: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "" },
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmitQuiz = async (e) => {
    e.preventDefault();
    const quizData = {
      title,
      description,
      maxScore: parseFloat(maxScore),
      courseId: id,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:8080/api/quizzes/create", quizData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setQuizId(response.data.id); // Lưu quizId sau khi tạo bài kiểm tra
        alert("Bài kiểm tra đã được tạo thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi tạo bài kiểm tra:", error);
      alert("Tạo bài kiểm tra thất bại. Vui lòng thử lại.");
    }
  };

  const handleSubmitQuestions = async (e) => {
    e.preventDefault();
    if (!quizId) {
      alert("Vui lòng tạo bài kiểm tra trước khi thêm câu hỏi.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const questionPromises = questions.map((question) =>
        axios.post(
          "http://localhost:8080/api/questions/add",
          { ...question, quizId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
      );

      await Promise.all(questionPromises);
      alert("Câu hỏi đã được thêm thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm câu hỏi:", error);
      alert("Thêm câu hỏi thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Tạo bài kiểm tra</h1>
      <form onSubmit={handleSubmitQuiz}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Tên bài kiểm tra
          </label>
          <input
            type="text"
            id="title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Mô tả bài kiểm tra
          </label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="maxScore" className="form-label">
            Điểm tối đa
          </label>
          <input
            type="number"
            id="maxScore"
            className="form-control"
            value={maxScore}
            onChange={(e) => setMaxScore(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Tạo bài kiểm tra
        </button>
      </form>

      {quizId && (
        <form onSubmit={handleSubmitQuestions} className="mt-5">
          <h3>Thêm câu hỏi</h3>
          {questions.map((question, index) => (
            <div key={index} className="mb-4">
              <label className="form-label">Nội dung câu hỏi</label>
              <input
                type="text"
                className="form-control"
                value={question.content}
                onChange={(e) => handleQuestionChange(index, "content", e.target.value)}
                required
              />
              <label className="form-label">Đáp án A</label>
              <input
                type="text"
                className="form-control"
                value={question.optionA}
                onChange={(e) => handleQuestionChange(index, "optionA", e.target.value)}
                required
              />
              <label className="form-label">Đáp án B</label>
              <input
                type="text"
                className="form-control"
                value={question.optionB}
                onChange={(e) => handleQuestionChange(index, "optionB", e.target.value)}
                required
              />
              <label className="form-label">Đáp án C</label>
              <input
                type="text"
                className="form-control"
                value={question.optionC}
                onChange={(e) => handleQuestionChange(index, "optionC", e.target.value)}
                required
              />
              <label className="form-label">Đáp án D</label>
              <input
                type="text"
                className="form-control"
                value={question.optionD}
                onChange={(e) => handleQuestionChange(index, "optionD", e.target.value)}
                required
              />
              <label className="form-label">Đáp án đúng</label>
              <input
                type="text"
                className="form-control"
                value={question.correctAnswer}
                onChange={(e) => handleQuestionChange(index, "correctAnswer", e.target.value)}
                required
              />
            </div>
          ))}
          <button type="button" className="btn btn-secondary mt-2" onClick={handleAddQuestion}>
            Thêm câu hỏi
          </button>
          <button type="submit" className="btn btn-success mt-3">
            Lưu câu hỏi
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateTest;