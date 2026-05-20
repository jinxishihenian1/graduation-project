import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    USER_NAME: "",
    USER_EMAIL: "",
    USER_PW: "",
    NICKNAME: "",
    JOB: "",
    MBTI: "",
    BIRTH_DATE: ""
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
            name="USER_NAME"
            placeholder="이름"
            value={form.USER_NAME}
            onChange={handleChange}
            required
          />

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

          <input
            name="NICKNAME"
            placeholder="닉네임"
            value={form.NICKNAME}
            onChange={handleChange}
          />

          <input
            name="JOB"
            placeholder="직업"
            value={form.JOB}
            onChange={handleChange}
          />

          <select name="MBTI" value={form.MBTI} onChange={handleChange}>
            <option value="">MBTI 선택</option>
            <option value="ISTJ">ISTJ</option>
            <option value="ISFJ">ISFJ</option>
            <option value="INFJ">INFJ</option>
            <option value="INTJ">INTJ</option>
            <option value="ISTP">ISTP</option>
            <option value="ISFP">ISFP</option>
            <option value="INFP">INFP</option>
            <option value="INTP">INTP</option>
            <option value="ESTP">ESTP</option>
            <option value="ESFP">ESFP</option>
            <option value="ENFP">ENFP</option>
            <option value="ENTP">ENTP</option>
            <option value="ESTJ">ESTJ</option>
            <option value="ESFJ">ESFJ</option>
            <option value="ENFJ">ENFJ</option>
            <option value="ENTJ">ENTJ</option>
          </select>

          <input
            type="date"
            name="BIRTH_DATE"
            value={form.BIRTH_DATE}
            onChange={handleChange}
          />

          <button type="submit">회원가입</button>
        </form>

        <Link to="/login">이미 계정이 있으신가요? 로그인</Link>
      </div>
    </div>
  );
}

export default Register;