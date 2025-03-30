import React, { useState } from "react";
import axios from "axios";
import "../../../src/App.css"; // Import file CSS

const Register = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("${API_DOMAIN}/auth/register", user);
      alert("Đăng ký thành công!");
    } catch (err) {
      alert("Đăng ký thất bại!");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Đăng ký</h2>
        <form onSubmit={handleRegister} className="register-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Tên đăng nhập"
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Mật khẩu"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <select
              onChange={(e) => setUser({ ...user, role: e.target.value })}
              className="form-input"
            >
              <option value="STUDENT">Học sinh</option>
              <option value="TEACHER">Giáo viên</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button type="submit" className="register-button">Đăng ký</button>
        </form>
      </div>
    </div>
  );
};

export default Register;