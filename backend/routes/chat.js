const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

/**
 * GET /api/chat/messages?user_id=1
 * 查询某个用户的聊天记录
 */
router.get("/messages", async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        message: "user_id가 필요합니다."
      });
    }

    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: true });

    if (error) {
      return res.status(500).json({
        message: "채팅 기록 조회 실패",
        error: error.message
      });
    }

    res.json({
      message: "채팅 기록 조회 성공",
      data
    });
  } catch (error) {
    res.status(500).json({
      message: "서버 오류",
      error: error.message
    });
  }
});

/**
 * POST /api/chat/messages
 * 사용자 또는 AI 채팅 메시지 저장
 */
router.post("/messages", async (req, res) => {
  try {
    const { user_id, chat_role, message } = req.body;

    if (!user_id || !chat_role || !message) {
      return res.status(400).json({
        message: "user_id, chat_role, message가 필요합니다."
      });
    }

    if (!["USER", "ASSISTANT"].includes(chat_role)) {
      return res.status(400).json({
        message: "chat_role은 USER 또는 ASSISTANT만 가능합니다."
      });
    }

    const { data, error } = await supabase
      .from("chat_messages")
      .insert([
        {
          user_id,
          chat_role,
          message
        }
      ])
      .select();

    if (error) {
      return res.status(500).json({
        message: "채팅 메시지 저장 실패",
        error: error.message
      });
    }

    res.status(201).json({
      message: "채팅 메시지 저장 성공",
      data: data[0]
    });
  } catch (error) {
    res.status(500).json({
      message: "서버 오류",
      error: error.message
    });
  }
});

/**
 * DELETE /api/chat/messages/:chat_id
 * 특정 채팅 메시지 삭제
 */
router.delete("/messages/:chat_id", async (req, res) => {
  try {
    const { chat_id } = req.params;
    const { user_id } = req.body;

    if (!chat_id || !user_id) {
      return res.status(400).json({
        message: "chat_id와 user_id가 필요합니다."
      });
    }

    const { error } = await supabase
      .from("chat_messages")
      .delete()
      .eq("chat_id", chat_id)
      .eq("user_id", user_id);

    if (error) {
      return res.status(500).json({
        message: "채팅 메시지 삭제 실패",
        error: error.message
      });
    }

    res.json({
      message: "채팅 메시지 삭제 성공"
    });
  } catch (error) {
    res.status(500).json({
      message: "서버 오류",
      error: error.message
    });
  }
});

/**
 * POST /api/chat/summary
 * 채팅 요약 데이터 저장
 *
 * 현재 ERD 기준 chat_summaries 테이블에는
 * summary_id, chat_id, user_id, message_count, created_at 정도가 있으므로
 * 요약 텍스트는 memory_embeddings 쪽에 저장하는 구조로 남겨둘 수 있음.
 */
router.post("/summary", async (req, res) => {
  try {
    const { chat_id, user_id, message_count } = req.body;

    if (!chat_id || !user_id || message_count === undefined) {
      return res.status(400).json({
        message: "chat_id, user_id, message_count가 필요합니다."
      });
    }

    const { data, error } = await supabase
      .from("chat_summaries")
      .insert([
        {
          chat_id,
          user_id,
          message_count
        }
      ])
      .select();

    if (error) {
      return res.status(500).json({
        message: "채팅 요약 저장 실패",
        error: error.message
      });
    }

    res.status(201).json({
      message: "채팅 요약 저장 성공",
      data: data[0]
    });
  } catch (error) {
    res.status(500).json({
      message: "서버 오류",
      error: error.message
    });
  }
});

module.exports = router;