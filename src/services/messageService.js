import apiClient from "./api.js";

// Message API contract (assumptions):
// POST /messages -> create a message (body: { userId, content }) returns { success, data: { conversationId, message } }
// GET /messages/conversations -> get user's conversations
// GET /messages/conversations/:conversationId -> get messages in conversation
// Admin endpoints:
// GET /admin/messages/conversations -> list all conversations (for admin)
// GET /admin/messages/conversations/:id -> messages
// POST /admin/messages/conversations/:id/reply -> admin reply

// Local mock helpers (fallback when backend endpoints are missing)
const MOCK_KEY = "mock_messages_v1";

function _loadMock() {
  try {
    const raw = localStorage.getItem(MOCK_KEY);
    return raw ? JSON.parse(raw) : { conversations: [] };
  } catch (e) {
    return { conversations: [] };
  }
}

function _saveMock(data) {
  localStorage.setItem(MOCK_KEY, JSON.stringify(data));
}

function _ensureConversationForUser(userId, userMeta = {}) {
  const db = _loadMock();
  let conv = db.conversations.find((c) => String(c.userId) === String(userId));
  if (!conv) {
    conv = {
      id: "conv_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
      userId,
      user: userMeta,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.conversations.push(conv);
    _saveMock(db);
  }
  return conv;
}

async function _mockSendMessage(payload) {
  const { userId, content, userMeta } = payload;
  if (!userId) throw new Error("userId required for mock message");

  const db = _loadMock();
  const conv = _ensureConversationForUser(userId, userMeta || {});

  const msg = {
    id: "msg_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
    from: "user",
    content,
    createdAt: new Date().toISOString(),
  };

  conv.messages.push(msg);
  conv.updatedAt = new Date().toISOString();
  conv.lastMessage = content;
  conv.lastMessagePreview = content.slice(0, 80);

  _saveMock(db);

  return {
    success: true,
    data: {
      conversationId: conv.id,
      conversation: conv,
      message: msg,
    },
  };
}

async function _mockGetConversations(userId) {
  const db = _loadMock();
  if (userId) {
    const conv = db.conversations.filter((c) => String(c.userId) === String(userId));
    return { success: true, data: conv };
  }
  // admin view: return all
  return { success: true, data: db.conversations };
}

async function _mockGetConversationMessages(conversationId) {
  const db = _loadMock();
  const conv = db.conversations.find((c) => c.id === conversationId);
  if (!conv) return { success: false, message: "Conversation not found" };
  return { success: true, data: { conversation: conv, messages: conv.messages } };
}

async function _mockAdminSendReply(conversationId, payload) {
  const db = _loadMock();
  const conv = db.conversations.find((c) => c.id === conversationId);
  if (!conv) return { success: false, message: "Conversation not found" };

  const msg = {
    id: "msg_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
    from: "admin",
    content: payload.content,
    createdAt: new Date().toISOString(),
  };

  conv.messages.push(msg);
  conv.updatedAt = new Date().toISOString();
  conv.lastMessage = payload.content;
  conv.lastMessagePreview = payload.content.slice(0, 80);
  _saveMock(db);

  return { success: true, data: { message: msg, conversation: conv } };
}

export const messageService = {
  // Send a new message from a user (creates conversation if needed)
  sendMessage: async (payload) => {
    if (!payload || !payload.content) {
      throw new Error("Invalid message payload");
    }

    try {
      return await apiClient.post(`/messages`, payload);
    } catch (err) {
      // If backend missing, fall back to local mock
      if (err?.message && (err.message.includes("404") || err.message.toLowerCase().includes("not found"))) {
        console.warn("messageService: backend /messages not found, using local mock");
        return await _mockSendMessage(payload);
      }
      throw err;
    }
  },

  // Get conversations for current authenticated user
  getUserConversations: async (userId = null) => {
    try {
      return await apiClient.get(`/messages/conversations`);
    } catch (err) {
      if (err?.message && (err.message.includes("404") || err.message.toLowerCase().includes("not found"))) {
        console.warn("messageService: backend /messages/conversations not found, using local mock");
        return await _mockGetConversations(userId);
      }
      throw err;
    }
  },

  // Get messages for a conversation (user view)
  getConversationMessages: async (conversationId) => {
    if (!conversationId) throw new Error("conversationId required");
    try {
      return await apiClient.get(`/messages/conversations/${conversationId}`);
    } catch (err) {
      if (err?.message && (err.message.includes("404") || err.message.toLowerCase().includes("not found"))) {
        console.warn("messageService: backend conversation messages not found, using local mock");
        return await _mockGetConversationMessages(conversationId);
      }
      throw err;
    }
  },

  // Admin: list conversations
  adminGetConversations: async (params = {}) => {
    try {
      return await apiClient.get(`/admin/messages/conversations`, params);
    } catch (err) {
      if (err?.message && (err.message.includes("404") || err.message.toLowerCase().includes("not found"))) {
        console.warn("messageService: backend admin conversations not found, using local mock");
        return await _mockGetConversations(null);
      }
      throw err;
    }
  },

  // Admin: get messages for a conversation
  adminGetConversationMessages: async (conversationId) => {
    if (!conversationId) throw new Error("conversationId required");
    try {
      return await apiClient.get(`/admin/messages/conversations/${conversationId}`);
    } catch (err) {
      if (err?.message && (err.message.includes("404") || err.message.toLowerCase().includes("not found"))) {
        console.warn("messageService: backend admin conversation messages not found, using local mock");
        return await _mockGetConversationMessages(conversationId);
      }
      throw err;
    }
  },

  // Admin: send reply in a conversation
  adminSendReply: async (conversationId, payload) => {
    if (!conversationId || !payload || !payload.content)
      throw new Error("Invalid reply payload");
    try {
      return await apiClient.post(
        `/admin/messages/conversations/${conversationId}/reply`,
        payload
      );
    } catch (err) {
      if (err?.message && (err.message.includes("404") || err.message.toLowerCase().includes("not found"))) {
        console.warn("messageService: backend admin reply not found, using local mock");
        return await _mockAdminSendReply(conversationId, payload);
      }
      throw err;
    }
  },
};

export default messageService;
