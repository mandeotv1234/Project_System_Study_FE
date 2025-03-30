import React, { useState } from "react";
import axios from "axios";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [lectures, setLectures] = useState([
    { title: "", description: "", materials: [{ title: "", type: "", url: "" }] },
  ]);

  const handleLectureChange = (index, field, value) => {
    const updatedLectures = [...lectures];
    updatedLectures[index][field] = value;
    setLectures(updatedLectures);
  };

  const handleMaterialChange = (lectureIndex, materialIndex, field, value) => {
    const updatedLectures = [...lectures];
    updatedLectures[lectureIndex].materials[materialIndex][field] = value;
    setLectures(updatedLectures);
  };

  const addLecture = () => {
    setLectures([...lectures, { title: "", description: "", materials: [{ title: "", type: "", url: "" }] }]);
  };

  const addMaterial = (lectureIndex) => {
    const updatedLectures = [...lectures];
    updatedLectures[lectureIndex].materials.push({ title: "", type: "", url: "" });
    setLectures(updatedLectures);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const courseData = {
      title,
      description,
      category,
      duration,
      price: parseFloat(price),
      lectures,
    };

    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      const response = await axios.post("http://localhost:8080/api/courses/create", courseData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert("Khóa học đã được tạo thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi tạo khóa học:", error);
      alert("Tạo khóa học thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Tạo khóa học</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Tên khóa học
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
            Mô tả khóa học
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
          <label htmlFor="category" className="form-label">
            Danh mục
          </label>
          <input
            type="text"
            id="category"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="duration" className="form-label">
            Thời lượng
          </label>
          <input
            type="text"
            id="duration"
            className="form-control"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Giá (VND)
          </label>
          <input
            type="number"
            id="price"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <h3 className="mt-4">Danh sách bài giảng</h3>
        {lectures.map((lecture, lectureIndex) => (
          <div key={lectureIndex} className="mb-4">
            <h5>Bài giảng {lectureIndex + 1}</h5>
            <div className="mb-3">
              <label className="form-label">Tiêu đề bài giảng</label>
              <input
                type="text"
                className="form-control"
                value={lecture.title}
                onChange={(e) => handleLectureChange(lectureIndex, "title", e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Mô tả bài giảng</label>
              <textarea
                className="form-control"
                value={lecture.description}
                onChange={(e) => handleLectureChange(lectureIndex, "description", e.target.value)}
                required
              />
            </div>
            <h6>Tài liệu</h6>
            {lecture.materials.map((material, materialIndex) => (
              <div key={materialIndex} className="mb-3">
                <label className="form-label">Tiêu đề tài liệu</label>
                <input
                  type="text"
                  className="form-control"
                  value={material.title}
                  onChange={(e) =>
                    handleMaterialChange(lectureIndex, materialIndex, "title", e.target.value)
                  }
                  required
                />
                <label className="form-label">Loại tài liệu</label>
                <input
                  type="text"
                  className="form-control"
                  value={material.type}
                  onChange={(e) =>
                    handleMaterialChange(lectureIndex, materialIndex, "type", e.target.value)
                  }
                  required
                />
                <label className="form-label">URL tài liệu</label>
                <input
                  type="text"
                  className="form-control"
                  value={material.url}
                  onChange={(e) =>
                    handleMaterialChange(lectureIndex, materialIndex, "url", e.target.value)
                  }
                  required
                />
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => addMaterial(lectureIndex)}
            >
              Thêm tài liệu
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-secondary mb-4" onClick={addLecture}>
          Thêm bài giảng
        </button>

        <button type="submit" className="btn btn-primary">
          Tạo khóa học
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;