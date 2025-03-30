import React, { useState } from "react";

const ProvideLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Gửi dữ liệu bài giảng lên server
    console.log("Bài giảng:", { lectureTitle, file });
    alert("Bài giảng đã được tải lên thành công!");
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Cung cấp bài giảng</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="lectureTitle" className="form-label">
            Tên bài giảng
          </label>
          <input
            type="text"
            id="lectureTitle"
            className="form-control"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="file" className="form-label">
            Tải lên tài liệu hoặc video
          </label>
          <input
            type="file"
            id="file"
            className="form-control"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Tải lên
        </button>
      </form>
    </div>
  );
};

export default ProvideLecture;