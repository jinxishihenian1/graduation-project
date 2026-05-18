import { useEffect, useState } from "react";
import axios from "axios";

function Community() {
  const [posts, setPosts] = useState([]);

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "스트레스"
  });

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:5000/api/community/posts");
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
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
        title: "",
        content: "",
        category: "스트레스"
      });

      fetchPosts();
    } catch (error) {
      alert("게시글 작성 실패");
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/community/posts/${postId}/like`,
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

  const handleComment = async (postId) => {
    const text = prompt("댓글을 입력하세요");
    if (!text) return;

    try {
      await axios.post(
        `http://localhost:5000/api/community/posts/${postId}/comments`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchPosts();
    } catch (error) {
      alert("댓글 작성 실패");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  return (
    <div className="community-page">
      <header className="community-header">
        <div>
          <h1>커뮤니티</h1>
          <p>함께 공유하고 성장하는 공간</p>
        </div>

        <div>
          <div className="user-badge">{username || "Guest"}</div>
          <button className="logout-btn" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </header>

      <section className="mood-box">
        <h2>오늘의 감정 참여</h2>
        <p>하루 한 번, 나의 기분을 공유해보세요</p>

        <div className="mood-grid">
          <button>😊 행복함</button>
          <button>😐 보통</button>
          <button>😰 긴장됨</button>
          <button>😢 슬픔</button>
          <button>💖 사랑스러움</button>
          <button>😴 피곤함</button>
        </div>
      </section>

      <section className="write-box">
        <h2>글쓰기</h2>

        <form onSubmit={handleCreatePost}>
          <input
            name="title"
            placeholder="제목을 입력하세요"
            value={form.title}
            onChange={handleChange}
            required
          />

          <select name="category" value={form.category} onChange={handleChange}>
            <option value="스트레스">스트레스</option>
            <option value="수면">수면</option>
            <option value="성취">성취</option>
            <option value="일상">일상</option>
          </select>

          <textarea
            name="content"
            placeholder="오늘의 생각을 공유해보세요"
            value={form.content}
            onChange={handleChange}
            required
          />

          <button type="submit">+ 글쓰기</button>
        </form>
      </section>

      <section className="post-list">
        <h2>오늘의 커뮤니티</h2>

        {posts.length === 0 && <p>아직 게시글이 없습니다.</p>}

        {posts.map((post) => (
          <div className="post-card" key={post._id}>
            <div className="post-top">
              <span className="category">{post.category}</span>
              <span>{post.author?.username}</span>
            </div>

            <h3>{post.title}</h3>
            <p>{post.content}</p>

            <div className="post-actions">
              <button onClick={() => handleLike(post._id)}>
                ♡ 좋아요 {post.likes}
              </button>

              <button onClick={() => handleComment(post._id)}>
                댓글 {post.comments.length}
              </button>
            </div>

            {post.comments.length > 0 && (
              <div className="comments">
                {post.comments.map((comment, index) => (
                  <p key={index}>
                    <strong>{comment.username}</strong>: {comment.text}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

export default Community;