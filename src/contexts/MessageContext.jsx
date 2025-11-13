import React, { createContext, useContext, useState, useEffect } from "react";
import messageService from "../services/messageService";
import { useAuth } from "./AuthContext";

const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const userId = user?.id || user?._id || user?.idUser || null;
      const userMeta = { email: user?.email, name: user?.fullName || user?.name };
      const res = await messageService.getUserConversations(userId);
      if (res?.success) setConversations(res.data || []);
    } catch (err) {
      console.error("Failed to load conversations", err);
    } finally {
      setLoading(false);
    }
  };

  const openConversation = async (conversationId) => {
    if (!conversationId) return;
    setLoading(true);
    try {
      const res = await messageService.getConversationMessages(conversationId);
      if (res?.success) {
        setCurrentConversation(res.data?.conversation || null);
        setMessages(res.data?.messages || []);
      }
    } catch (err) {
      console.error("Failed to open conversation", err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content) => {
    if (!user) throw new Error("User must be logged in to send messages");
    if (!content || !content.trim()) throw new Error("Empty message");

    const payload = {
      userId: user.id || user._id || user.idUser || null,
      userMeta: { email: user.email, name: user.fullName || user.name },
      content: content.trim(),
    };

    const res = await messageService.sendMessage(payload);
    if (res?.success) {
      // After send, refresh conversations and open the conversation returned
      await fetchConversations();
      const convId = res.data?.conversationId || res.data?.conversation?.id;
      if (convId) await openConversation(convId);
      return res;
    }

    throw new Error(res?.message || "Không gửi được tin nhắn");
  };

  useEffect(() => {
    if (user) fetchConversations();
    else {
      setConversations([]);
      setCurrentConversation(null);
      setMessages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <MessageContext.Provider
      value={{
        conversations,
        fetchConversations,
        openConversation,
        currentConversation,
        messages,
        sendMessage,
        loading,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const ctx = useContext(MessageContext);
  if (!ctx) throw new Error("useMessages must be used within MessageProvider");
  return ctx;
};

export default MessageContext;
