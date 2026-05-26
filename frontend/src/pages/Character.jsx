import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Character() {
  const navigate = useNavigate();

  const USER_NAME = localStorage.getItem("USER_NAME");

  const [selectedMood, setSelectedMood] = useState("보통이에요");
  const [message, setMessage] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  const [foodModalOpen, setFoodModalOpen] = useState(false);
  const [playModalOpen, setPlayModalOpen] = useState(false);
  const [hobbyModalOpen, setHobbyModalOpen] = useState(false);
  const [musicModalOpen, setMusicModalOpen] = useState(false);

  const [selectedFood, setSelectedFood] = useState("");
  const [selectedPlay, setSelectedPlay] = useState("");
  const [selectedHobby, setSelectedHobby] = useState("");
  const [selectedMusic, setSelectedMusic] = useState("");

  const moodOptions = [
    {
      label: "좋아요",
      face: "happy",
      characterText: "기분이 좋아 보여요! 오늘 좋은 일이 있었나요?"
    },
    {
      label: "보통이에요",
      face: "normal",
      characterText: "사용자님, 오늘 하루는 어떠셨나요?"
    },
    {
      label: "안 좋아요",
      face: "sad",
      characterText: "오늘은 기분이 좋지 않아 보여요. 함께 있어줄게요."
    }
  ];

  const foodOptions = ["매운 음식", "달콤한 디저트", "색다른 음식"];
  const playOptions = ["액티비티 활동", "집에서 쉬기", "노래 듣기"];
  const hobbyOptions = ["책 읽기", "영화 보기", "운동하기"];
  const musicOptions = ["차분한 음악", "신나는 음악", "자연의 소리"];

  const selectedMoodData = moodOptions.find(
    (mood) => mood.label === selectedMood
  );

  const getAIReply = () => {
    if (selectedMood === "좋아요") {
      return "기분이 좋아 보여요! 오늘의 좋은 감정을 오래 기억해봐요.";
    }

    if (selectedMood === "보통이에요") {
      return "평범한 하루도 충분히 의미 있어요. 오늘 하루도 잘 보내고 있어요.";
    }

    if (selectedMood === "안 좋아요") {
      return "오늘은 기분이 좋지 않아 보여요. 괜찮아요, 제가 옆에서 함께 있어줄게요.";
    }

    return "오늘의 감정을 천천히 이야기해보세요.";
  };

  const openChatWithMood = () => {
    setChatMessages([
      {
        role: "ai",
        content: getAIReply()
      }
    ]);
    setChatOpen(true);
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      openChatWithMood();
      return;
    }

    const userMessage = {
      role: "user",
      content: message
    };

    const aiMessage = {
      role: "ai",
      content: getAIReply()
    };

    setChatMessages((prev) => [...prev, userMessage, aiMessage]);
    setMessage("");
    setChatOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("USER_ID");
    localStorage.removeItem("USER_NAME");
    navigate("/login");
  };

  return (
    <div className="character-page">
      <header className="character-header">
        <div></div>

        <h1 className="character-title">오늘 기분이 어떠세요?</h1>

        <div className="character-user-area">
          {USER_NAME ? (
            <>
              <div className="user-badge">{USER_NAME}</div>
              <button className="logout-btn" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <button
              className="login-small-btn"
              onClick={() => navigate("/login")}
            >
              로그인
            </button>
          )}
        </div>
      </header>

      <section className="mood-select-card">
        {moodOptions.map((mood) => (
          <button
            key={mood.label}
            className={
              selectedMood === mood.label
                ? "character-mood-btn active-character-mood"
                : "character-mood-btn"
            }
            onClick={() => {
              setSelectedMood(mood.label);
              setChatMessages([]);
              setChatOpen(false);
            }}
          >
            <span className={`line-face-icon ${mood.face}`}>
              <span className="face-mouth"></span>
            </span>
            <span>{mood.label}</span>
          </button>
        ))}
      </section>

      <section className="character-card">
        <div className={`character-face ${selectedMoodData.face}`}>
          {selectedMoodData.face === "happy" && (
            <>
              <div className="eye happy-left">^</div>
              <div className="eye happy-right">^</div>
              <div className="smile"></div>
              <div className="cheek left-cheek"></div>
              <div className="cheek right-cheek"></div>
            </>
          )}

          {selectedMoodData.face === "normal" && (
            <>
              <div className="dot-eye left-eye"></div>
              <div className="dot-eye right-eye"></div>
              <div className="normal-mouth"></div>
            </>
          )}

          {selectedMoodData.face === "sad" && (
            <>
              <div className="closed-eye left-closed"></div>
              <div className="closed-eye right-closed"></div>
              <div className="sad-mouth"></div>
            </>
          )}
        </div>
      </section>

      <section className="today-message-box" onClick={openChatWithMood}>
        <p>{selectedMoodData.characterText}</p>
      </section>

      <section className="quick-action-grid">
        <button onClick={() => setFoodModalOpen(true)}>🍴 먹이 주기</button>
        <button onClick={() => setPlayModalOpen(true)}>✨ 놀아주기</button>
        <button onClick={() => setHobbyModalOpen(true)}>♡ 취미 공유</button>
        <button onClick={() => setMusicModalOpen(true)}>♫ 음악 듣기</button>
      </section>

      {(selectedFood || selectedPlay || selectedHobby || selectedMusic) && (
        <section className="known-info-box">
          <h2>알게 된 정보</h2>

          {selectedFood && (
            <p>
              <span className="pink-dot"></span>
              먹이: {selectedFood}
            </p>
          )}

          {selectedPlay && (
            <p>
              <span className="pink-dot"></span>
              놀이: {selectedPlay}
            </p>
          )}

          {selectedHobby && (
            <p>
              <span className="pink-dot"></span>
              취미: {selectedHobby}
            </p>
          )}

          {selectedMusic && (
            <p>
              <span className="pink-dot"></span>
              음악: {selectedMusic}
            </p>
          )}
        </section>
      )}

      {foodModalOpen && (
        <PreferenceModal
          title="어떤 걸 선호하시나요?"
          options={foodOptions}
          onClose={() => setFoodModalOpen(false)}
          onSelect={(value) => {
            setSelectedFood(value);
            setFoodModalOpen(false);
          }}
        />
      )}

      {playModalOpen && (
        <PreferenceModal
          title="어떤 걸 선호하시나요?"
          options={playOptions}
          onClose={() => setPlayModalOpen(false)}
          onSelect={(value) => {
            setSelectedPlay(value);
            setPlayModalOpen(false);
          }}
        />
      )}

      {hobbyModalOpen && (
        <PreferenceModal
          title="어떤 걸 선호하시나요?"
          options={hobbyOptions}
          onClose={() => setHobbyModalOpen(false)}
          onSelect={(value) => {
            setSelectedHobby(value);
            setHobbyModalOpen(false);
          }}
        />
      )}

      {musicModalOpen && (
        <PreferenceModal
          title="어떤 걸 선호하시나요?"
          options={musicOptions}
          onClose={() => setMusicModalOpen(false)}
          onSelect={(value) => {
            setSelectedMusic(value);
            setMusicModalOpen(false);
          }}
        />
      )}

      {chatOpen && (
        <div className="chat-modal-overlay">
          <section className="chat-modal">
            <div className="chat-header">
              <div className="chat-title">
                <span className="chat-icon">💬</span>
                <strong>캐릭터와 대화</strong>
              </div>

              <button className="chat-close" onClick={() => setChatOpen(false)}>
                ×
              </button>
            </div>

            <div className="chat-body">
              {chatMessages.map((chat, index) => (
                <div
                  key={index}
                  className={
                    chat.role === "user" ? "user-message" : "ai-message"
                  }
                >
                  {chat.content}
                </div>
              ))}
            </div>

            <div className="chat-input-row">
              <input
                placeholder="메시지를 입력하세요..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />

              <button onClick={handleSendMessage}>➤</button>
            </div>
          </section>
        </div>
      )}

      <nav className="bottom-nav">
        <button className="active-nav" onClick={() => navigate("/character")}>
          ⌂<span>캐릭터</span>
        </button>

        <button onClick={() => navigate("/diary")}>
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

function PreferenceModal({ title, options, onClose, onSelect }) {
  return (
    <div className="food-modal-overlay">
      <section className="food-modal">
        <div className="food-modal-header">
          <h2>{title}</h2>
          <button onClick={onClose}>취소</button>
        </div>

        <div className="food-option-list">
          {options.map((option) => (
            <button key={option} onClick={() => onSelect(option)}>
              {option}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Character;