import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("회원가입 성공");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "회원가입 실패");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>회원가입</h1>
        <p>나의 감정을 기록하고 공유해보세요</p>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="username"
            placeholder="이름"
            value={form.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">회원가입</button>
        </form>

        <Link to="/login">이미 계정이 있으신가요? 로그인</Link>
      </div>
    </div>
  );
}

export default Register;