import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CreateAssignment = () => {
  const { id } = useParams(); // Lấy courseId từ URL
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const assignmentData = {
      title,
      description,
      dueDate,
      courseId: id,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/api/assignments/create",
        assignmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Bài tập đã được tạo thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi tạo bài tập:", error);
      alert("Tạo bài tập thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Thêm bài tập</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Tiêu đề bài tập
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
            Mô tả bài tập
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
          <label htmlFor="dueDate" className="form-label">
            Hạn nộp
          </label>
          <input
            type="datetime-local"
            id="dueDate"
            className="form-control"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Thêm bài tập
        </button>
      </form>
    </div>
  );
};

export default CreateAssignment;