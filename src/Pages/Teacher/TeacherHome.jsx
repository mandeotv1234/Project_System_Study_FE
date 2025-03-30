import React, { useState } from "react";
import { Button, Modal, Form, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const TeacherHome = () => {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([
    { id: 1, title: "Bài tập Toán tuần 1" },
    { id: 2, title: "Bài tập Lý tuần 1" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState("");

  const handleAddAssignment = () => {
    if (newAssignment.trim()) {
      setAssignments([...assignments, { id: assignments.length + 1, title: newAssignment }]);
      setNewAssignment("");
      setShowModal(false);
      alert("Bài tập mới đã được thêm!");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Trang Giáo viên</h1>

      {/* Các chức năng chính */}
      <div className="mb-4">
        <Button
          variant="success"
          className="me-2"
          onClick={() => navigate("/teacher/create-course")}
        >
          Tạo khóa học
        </Button>

        <Button
  variant="primary"
  className="me-2"
  onClick={() => navigate("/teacher/courses")}
>
  Danh sách khóa học
</Button>
        <Button
          variant="info"
          className="me-2"
          onClick={() => navigate("/teacher/provide-lecture")}
        >
          Cung cấp bài giảng
        </Button>
        <Button
          variant="warning"
          className="me-2"
          onClick={() => navigate("/teacher/create-assignment")}
        >
          Tạo bài tập
        </Button>
        <Button
          variant="primary"
          className="me-2"
          onClick={() => navigate("/teacher/create-test")}
        >
          Tạo bài kiểm tra
        </Button>
        <Button
          variant="danger"
          onClick={() => navigate("/teacher/grade-assignment")}
        >
          Chấm điểm bài tập
        </Button>
      </div>

      {/* Danh sách bài tập đã giao */}
      <div>
        <h3>Bài tập đã giao</h3>
        <ListGroup>
          {assignments.map((item) => (
            <ListGroup.Item key={item.id}>{item.title}</ListGroup.Item>
          ))}
        </ListGroup>
      </div>

      {/* Modal thêm bài tập */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Giao bài tập mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="assignmentTitle">
              <Form.Label>Tên bài tập</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên bài tập"
                value={newAssignment}
                onChange={(e) => setNewAssignment(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleAddAssignment}>
            Thêm bài tập
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TeacherHome;