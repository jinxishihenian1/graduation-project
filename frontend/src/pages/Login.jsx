import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    USER_EMAIL: "",
    USER_PW: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("USER_ID", res.data.user.USER_ID);
      localStorage.setItem("USER_NAME", res.data.user.USER_NAME);

      alert("로그인 성공");
      navigate("/community");
    } catch (error) {
      alert(error.response?.data?.message || "로그인 실패");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>로그인</h1>
        <p>오늘의 감정을 함께 나눠보세요</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="USER_EMAIL"
            placeholder="이메일"
            value={form.USER_EMAIL}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="USER_PW"
            placeholder="비밀번호"
            value={form.USER_PW}
            onChange={handleChange}
            required
          />

          <button type="submit">로그인</button>
        </form>

        <Link to="/register">계정이 없으신가요? 회원가입</Link>
      </div>
    </div>
  );
}

export default Login;