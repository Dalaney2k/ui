// components/Common/ChatModal.jsx
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useMessages } from "../../contexts/MessageContext";
import {
  X,
  Send,
  User,
  Bot,
  Smile,
  Paperclip,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Circle,
} from "lucide-react";

const ChatModal = ({ isOpen, onClose, productInfo = null }) => {
  const { user } = useAuth();
  const { messages: ctxMessages, sendMessage: ctxSendMessage, loading } =
    useMessages();

  // Local UI state for new message and typing indicator
  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // sync context messages into local view
    if (ctxMessages && ctxMessages.length > 0) setMessages(ctxMessages);
    scrollToBottom();
  }, [ctxMessages]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      // if no conversation yet, show a welcome placeholder message
      if ((!ctxMessages || ctxMessages.length === 0) && productInfo) {
        setMessages([
          {
            id: "welcome",
            type: "bot",
            message: `Xin chào! Tôi thấy bạn đang quan tâm đến "${productInfo.name}". Bạn có câu hỏi gì về sản phẩm này không?`,
            timestamp: new Date(),
            sender: "Nhân viên hỗ trợ",
          },
        ]);
      }
    }
  }, [isOpen, productInfo]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    if (!user) {
      // prompt login - for simplicity, just alert here; app can show modal instead
      alert("Vui lòng đăng nhập để gửi tin nhắn tới nhân viên hỗ trợ.");
      return;
    }

    try {
      setIsTyping(true);
      await ctxSendMessage(newMessage.trim());
      setNewMessage("");
    } catch (err) {
      console.error("Send message failed", err);
      alert(err.message || "Gửi tin nhắn thất bại");
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 flex items-end justify-end p-4">
      <div className="bg-white rounded-t-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <User size={20} />
              </div>
              {isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <div className="font-semibold">Hỗ trợ khách hàng</div>
              <div className="text-xs text-blue-100 flex items-center gap-1">
                {isOnline ? (
                  <>
                    <Circle className="w-2 h-2 fill-green-400 text-green-400" />
                    Đang hoạt động
                  </>
                ) : (
                  <>
                    <Circle className="w-2 h-2 fill-gray-400 text-gray-400" />
                    Offline
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <Phone size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.type === "user"
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-white text-gray-900 rounded-bl-md shadow-sm"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.message}</p>
                <div
                  className={`text-xs mt-1 flex items-center gap-1 ${
                    msg.type === "user" ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  <Clock size={10} />
                  {formatTime(msg.timestamp)}
                  {msg.type === "user" && (
                    <CheckCircle2 size={10} className="ml-1" />
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-end gap-2">
            <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
              <Paperclip size={20} />
            </button>

            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="w-full px-4 py-3 bg-gray-100 rounded-2xl resize-none outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all max-h-20"
                rows="1"
                style={{
                  minHeight: "44px",
                  height:
                    Math.min(
                      44 + (newMessage.split("\n").length - 1) * 20,
                      80
                    ) + "px",
                }}
              />
            </div>

            <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
              <Smile size={20} />
            </button>

            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded-full transition-colors disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>

          <div className="text-xs text-gray-500 mt-2 text-center">
            Thường phản hồi trong vài phút
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ChatModal;
