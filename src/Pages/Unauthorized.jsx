import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Quay lại trang trước
  };

  const handleGoHome = () => {
    navigate("/"); // Điều hướng về trang chủ
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="display-3 text-danger">403</h1>
      <h2 className="mb-4">Truy cập bị từ chối</h2>
      <p className="lead">
        Bạn không có quyền truy cập vào trang này. Vui lòng kiểm tra lại quyền truy cập hoặc liên hệ với quản trị viên.
      </p>
      <div className="mt-4">
        <button className="btn btn-secondary me-3" onClick={handleGoBack}>
          Quay lại
        </button>
        <button className="btn btn-primary" onClick={handleGoHome}>
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;