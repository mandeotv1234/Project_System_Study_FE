import React, { useState } from "react";

const GradeAssignment = () => {
  const [submissions] = useState([
    { id: 1, student: "Nguyễn Văn A", file: "baitap1.pdf" },
    { id: 2, student: "Trần Thị B", file: "baitap2.pdf" },
  ]);

  const handleGrade = (id) => {
    alert(`Đã chấm điểm bài tập của sinh viên ID: ${id}`);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Chấm điểm bài tập</h1>
      <ul className="list-group">
        {submissions.map((submission) => (
          <li key={submission.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5>{submission.student}</h5>
              <p>{submission.file}</p>
            </div>
            <button className="btn btn-success" onClick={() => handleGrade(submission.id)}>
              Chấm điểm
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GradeAssignment;