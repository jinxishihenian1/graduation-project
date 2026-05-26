import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function DiaryWrite() {
  const navigate = useNavigate();
  const { date } = useParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const formatKoreanDate = (dateString) => {
    const targetDate = new Date(dateString);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1;
    const day = targetDate.getDate();
    const weekList = ["일", "월", "화", "수", "목", "금", "토"];
    const week = weekList[targetDate.getDay()];

    return `${year}년 ${month}월 ${day}일 (${week})`;
  };

  useEffect(() => {
    const diaries = JSON.parse(localStorage.getItem("diaries") || "{}");

    if (diaries[date]) {
      setTitle(diaries[date].title);
      setContent(diaries[date].content);
    }
  }, [date]);

  const handleSave = () => {
    const diaries = JSON.parse(localStorage.getItem("diaries") || "{}");

    diaries[date] = {
      title,
      content,
      date,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem("diaries", JSON.stringify(diaries));
    alert("일기가 저장되었습니다.");
    navigate("/diary");
  };

  return (
    <div className="diary-write-page">
      <header className="diary-write-header">
        <button className="back-btn" onClick={() => navigate("/diary")}>
          ←
        </button>

        <h1>{formatKoreanDate(date)}</h1>

        <button className="save-text-btn" onClick={handleSave}>
          저장
        </button>
      </header>

      <section className="diary-paper">
        <input
          className="diary-title-input"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="diary-content-input"
          placeholder="오늘 하루 어떠셨나요?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </section>

      <nav className="bottom-nav">
        <button onClick={() => navigate("/character")}>
          ⌂<span>캐릭터</span>
        </button>

        <button className="active-nav" onClick={() => navigate("/diary")}>
          ▣<span>일기</span>
        </button>

        <button>
          ⌁<span>리포트</span>
        </button>

        <button onClick={() => navigate("/community")}>
          ♙<span>커뮤니티</span>
        </button>
      </nav>
    </div>
  );
}

export default DiaryWrite;