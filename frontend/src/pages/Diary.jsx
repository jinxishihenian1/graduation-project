import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Diary() {
  const navigate = useNavigate();

  const today = new Date();

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();

  const savedDiaries = JSON.parse(localStorage.getItem("diaries") || "{}");

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getDateKey = (day) => {
    const month = String(currentMonth).padStart(2, "0");
    const date = String(day).padStart(2, "0");
    return `${currentYear}-${month}-${date}`;
  };

  const getTodayKey = () => {
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const date = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${date}`;
  };

  const goToWrite = (day) => {
    const dateKey = getDateKey(day);
    navigate(`/diary/write/${dateKey}`);
  };

  const calendarCells = [];

  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  return (
    <div className="diary-page">
      <section className="calendar-card">
        <div className="calendar-header">
          <h1>
            {currentYear}년 {currentMonth}월
          </h1>

          <div className="calendar-arrows">
            <button onClick={handlePrevMonth}>‹</button>
            <button onClick={handleNextMonth}>›</button>
          </div>
        </div>

        <div className="week-row">
          <span className="sunday">일</span>
          <span>월</span>
          <span>화</span>
          <span>수</span>
          <span>목</span>
          <span>금</span>
          <span className="saturday">토</span>
        </div>

        <div className="calendar-grid">
          {calendarCells.map((day, index) => {
            if (!day) {
              return <div key={index} className="calendar-empty"></div>;
            }

            const dateKey = getDateKey(day);
            const todayKey = getTodayKey();

            const hasDiary = savedDiaries[dateKey];
            const isToday = dateKey === todayKey;

            return (
              <button
                key={index}
                className={[
                  "calendar-day",
                  hasDiary ? "diary-written-day" : "",
                  isToday ? "today-day" : ""
                ].join(" ")}
                onClick={() => goToWrite(day)}
              >
                <span>{day}</span>

                {isToday && <small className="today-label">오늘</small>}
                {!isToday && hasDiary && <small className="diary-dot">●</small>}
              </button>
            );
          })}
        </div>

        <div className="mood-legend">
            <span>
                <span className="legend-face happy">
                    <span className="face-mouth"></span>
                </span>
                좋음
            </span>

            <span>
                <span className="legend-face normal">
                    <span className="face-mouth"></span>
                </span>
                보통
            </span>

            <span>
                <span className="legend-face sad">
                    <span className="face-mouth"></span>
                </span>
                힘듬
            </span>
        </div>
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

export default Diary;