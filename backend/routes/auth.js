const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();

// 회원가입
router.post("/register", async (req, res) => {
  try {
    const { USER_NAME, USER_EMAIL, USER_PW, NICKNAME, JOB, MBTI, BIRTH_DATE } =
      req.body;

    const existingUser = await pool.query(
      "SELECT * FROM USERS WHERE USER_EMAIL = $1",
      [USER_EMAIL]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "이미 가입된 이메일입니다." });
    }

    const hashedPassword = await bcrypt.hash(USER_PW, 10);

    await pool.query(
      `INSERT INTO USERS 
      (USER_NAME, USER_EMAIL, USER_PW, NICKNAME, JOB, MBTI, BIRTH_DATE)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        USER_NAME,
        USER_EMAIL,
        hashedPassword,
        NICKNAME || null,
        JOB || null,
        MBTI || null,
        BIRTH_DATE || null
      ]
    );

    res.status(201).json({ message: "회원가입 성공" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "회원가입 실패" });
  }
});

// 로그인
router.post("/login", async (req, res) => {
  try {
    const { USER_EMAIL, USER_PW } = req.body;

    const result = await pool.query(
      "SELECT * FROM USERS WHERE USER_EMAIL = $1",
      [USER_EMAIL]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "가입되지 않은 이메일입니다." });
    }

    const user = result.rows[0];

    const isPasswordCorrect = await bcrypt.compare(USER_PW, user.user_pw);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    const token = jwt.sign(
      {
        USER_ID: user.user_id,
        USER_NAME: user.user_name
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "로그인 성공",
      token,
      user: {
        USER_ID: user.user_id,
        USER_NAME: user.user_name,
        USER_EMAIL: user.user_email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "로그인 실패" });
  }
});

module.exports = router;