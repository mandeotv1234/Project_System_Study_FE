import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Sửa lại import jwtDecode
import "bootstrap/dist/css/bootstrap.min.css";
import  API_DOMAIN  from "../../Utils/request"; // Đường dẫn tùy thuộc vào cấu trúc dự án của bạn

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_DOMAIN}/auth/login`, {
        username,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      const role = decoded.role;

      if (role === "STUDENT") {
        navigate("/student-dashboard");
      } else if (role === "TEACHER") {
        navigate("/teacher-dashboard");
      } 
      else if (role === "ADMIN") {
        navigate("/admin/chat"); // Đường dẫn đến trang admin
      }
       
      else {
        navigate("/");
      }
    } catch (err) {
      alert("Đăng nhập thất bại!");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Đăng nhập</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Nhập tên đăng nhập"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Nhập mật khẩu"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;