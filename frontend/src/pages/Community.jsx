import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Community() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [backgroundColor, setBackgroundColor] = useState("pink");

  const [participantCount, setParticipantCount] = useState(0);
  const [hasParticipated, setHasParticipated] = useState(false);

  const [form, setForm] = useState({
    CONTENT: "",
    MOOD: "행복함"
  });

  const token = localStorage.getItem("token");
  const USER_ID = localStorage.getItem("USER_ID");
  const USER_NAME = localStorage.getItem("USER_NAME");

  const moodOptions = [
    { label: "행복함", emoji: "😊" },
    { label: "보통", emoji: "😐" },
    { label: "긴장됨", emoji: "😰" },
    { label: "슬픔", emoji: "😢" },
    { label: "사랑스러움", emoji: "💖" },
    { label: "피곤함", emoji: "😴" }
  ];

  const categoryOptions = [
    "전체",
    "행복함",
    "보통",
    "긴장됨",
    "슬픔",
    "사랑스러움",
    "피곤함"
  ];

  const increaseParticipant = () => {
    if (!hasParticipated) {
      setParticipantCount((prev) => prev + 1);
      setHasParticipated(true);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/community/posts");
      setPosts(res.data);

      res.data.forEach((post) => {
        fetchComments(post.post_id);
      });
    } catch (error) {
      alert("게시글 조회 실패");
    }
  };

  const fetchComments = async (POST_ID) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/community/posts/${POST_ID}/comments`
      );

      setComments((prev) => ({
        ...prev,
        [POST_ID]: res.data
      }));
    } catch (error) {
      console.log("댓글 조회 실패", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleMoodSelect = (mood) => {
    setForm({
      ...form,
      MOOD: mood
    });

    increaseParticipant();
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/community/posts", form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setForm({
        CONTENT: "",
        MOOD: "행복함"
      });

      increaseParticipant();
      fetchPosts();
    } catch (error) {
      alert("게시글 작성 실패");
    }
  };

  const handleDeletePost = async (POST_ID) => {
    if (!window.confirm("게시글을 삭제하시겠습니까?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/community/posts/${POST_ID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchPosts();
    } catch (error) {
      alert(error.response?.data?.message || "게시글 삭제 실패");
    }
  };

  const handleLike = async (POST_ID) => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/community/posts/${POST_ID}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchPosts();
    } catch (error) {
      alert("좋아요 실패");
    }
  };

  const handleCreateComment = async (POST_ID) => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    const CONTENT = prompt("댓글을 입력하세요");

    if (!CONTENT) return;

    try {
      await axios.post(
        `http://localhost:5000/api/community/posts/${POST_ID}/comments`,
        { CONTENT },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      increaseParticipant();
      fetchComments(POST_ID);
      fetchPosts();
    } catch (error) {
      alert("댓글 작성 실패");
    }
  };

  const handleDeleteComment = async (POST_COMMENT_ID, POST_ID) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/community/comments/${POST_COMMENT_ID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchComments(POST_ID);
      fetchPosts();
    } catch (error) {
      alert(error.response?.data?.message || "댓글 삭제 실패");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("USER_ID");
    localStorage.removeItem("USER_NAME");
    navigate("/login");
  };

  const filteredPosts = posts.filter((post) => {
    const matchSearch = post.content
      ?.toLowerCase()
      .includes(searchText.toLowerCase());

    const matchCategory =
      selectedCategory === "전체" || post.mood === selectedCategory;

    return matchSearch && matchCategory;
  });

  const aiRecommendedPost = posts
    .slice()
    .sort(
      (a, b) =>
        Number(b.like_count || 0) +
        Number(b.comment_count || 0) -
        (Number(a.like_count || 0) + Number(a.comment_count || 0))
    )[0];

  return (
    <div
      className={`community-page ${
        backgroundColor === "pink" ? "bg-pink" : "bg-blue"
      }`}
    >
      <header className="community-header">
        <div>
          <h1>커뮤니티</h1>
          <p>함께 공유하고 성장하는 공간</p>
        </div>

        <div className="right-header">
          <div className="color-picker">
            <button
              className="color-circle pink-circle"
              onClick={() => setBackgroundColor("pink")}
              title="핑크 배경"
            ></button>

            <button
              className="color-circle blue-circle"
              onClick={() => setBackgroundColor("blue")}
              title="블루 배경"
            ></button>
          </div>

          <div className="user-badge">{USER_NAME || "Guest"}</div>

          {USER_NAME ? (
            <button className="logout-btn" onClick={handleLogout}>
              로그아웃
            </button>
          ) : (
            <button className="logout-btn" onClick={() => navigate("/login")}>
              로그인
            </button>
          )}
        </div>
      </header>

      <section className="mood-box">
        <div className="section-title-row">
          <div>
            <h2>오늘의 감정 참여</h2>
            <p>하루 한 번, 나의 기분을 공유해보세요</p>
          </div>

          <span className="participant-badge">👥 {participantCount}명</span>
        </div>

        <div className="mood-grid mood-grid-six">
          {moodOptions.map((mood) => (
            <button
              key={mood.label}
              className={form.MOOD === mood.label ? "selected-mood" : ""}
              onClick={() => handleMoodSelect(mood.label)}
            >
              <span className="mood-emoji">{mood.emoji}</span>
              <span>{mood.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="filter-box">
        <input
          className="search-input"
          placeholder="게시글 검색..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <div className="filter-group">
          <h3>카테고리</h3>

          <div className="chip-row">
            {categoryOptions.map((category) => (
              <button
                key={category}
                className={
                  selectedCategory === category ? "chip active-chip" : "chip"
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="ai-box">
        <h2>✨ AI 추천</h2>

        {aiRecommendedPost ? (
          <p>
            최근 반응이 좋은 글이에요:{" "}
            <strong>{aiRecommendedPost.content.slice(0, 40)}...</strong>
          </p>
        ) : (
          <p>추천할 게시글이 아직 없습니다.</p>
        )}
      </section>

      <section className="write-box">
        <h2>글쓰기</h2>

        <form onSubmit={handleCreatePost}>
          <select
            name="MOOD"
            value={form.MOOD}
            onChange={(e) => setForm({ ...form, MOOD: e.target.value })}
          >
            {moodOptions.map((mood) => (
              <option key={mood.label} value={mood.label}>
                {mood.label}
              </option>
            ))}
          </select>

          <textarea
            name="CONTENT"
            placeholder="오늘의 생각을 공유해보세요"
            value={form.CONTENT}
            onChange={(e) => setForm({ ...form, CONTENT: e.target.value })}
            required
          />

          <button type="submit">+ 글쓰기</button>
        </form>
      </section>

      <section className="post-list">
        <h2>오늘의 커뮤니티</h2>

        {filteredPosts.length === 0 && <p>검색 결과가 없습니다.</p>}

        {filteredPosts.map((post) => (
          <div className="post-card" key={post.post_id}>
            <div className="post-top">
              <span className="category">{post.mood}</span>
              <span>{post.user_name}</span>
            </div>

            <p>{post.content}</p>

            <div className="post-info">
              <span>좋아요 {post.like_count}</span>
              <span>댓글 {post.comment_count}</span>
            </div>

            <div className="post-actions">
              <button onClick={() => handleLike(post.post_id)}>
                ♡ 좋아요
              </button>

              <button onClick={() => handleCreateComment(post.post_id)}>
                댓글
              </button>

              {String(post.user_id) === String(USER_ID) && (
                <button
                  className="delete-btn"
                  onClick={() => handleDeletePost(post.post_id)}
                >
                  삭제
                </button>
              )}
            </div>

            <div className="comments">
              {(comments[post.post_id] || []).map((comment) => (
                <div className="comment-item" key={comment.post_comment_id}>
                  <p>
                    <strong>{comment.user_name}</strong>: {comment.content}
                  </p>

                  {String(comment.user_id) === String(USER_ID) && (
                    <button
                      className="comment-delete-btn"
                      onClick={() =>
                        handleDeleteComment(
                          comment.post_comment_id,
                          post.post_id
                        )
                      }
                    >
                      댓글 삭제
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <nav className="bottom-nav">
        <button onClick={() => navigate("/character")}>
          ⌂<span>캐릭터</span>
        </button>

        <button onClick={() => navigate("/diary")}>
          ▣<span>일기</span>
        </button>

        <button>
          ⌁<span>리포트</span>
        </button>

        <button className="active-nav" onClick={() => navigate("/community")}>
          ♙<span>커뮤니티</span>
        </button>
      </nav>
    </div>
  );
}

export default Community;