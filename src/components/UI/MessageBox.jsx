import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useMessages } from "../../contexts/MessageContext";

const MessageBox = ({ onClose, productInfo = null }) => {
  const { user } = useAuth();
  const { messages, sendMessage, fetchConversations, loading } = useMessages();
  const [text, setText] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    if (!user) {
      alert("Vui lòng đăng nhập để gửi tin nhắn");
      return;
    }
    try {
      await sendMessage(text.trim());
      setText("");
      await fetchConversations();
    } catch (err) {
      console.error(err);
      alert(err.message || "Gửi thất bại");
    }
  };

  return (
    <div className="chat-box fixed bottom-6 right-6 w-full max-w-md z-50">
      <div className="bg-white rounded shadow-lg overflow-hidden flex flex-col h-96">
        <div className="p-3 bg-blue-600 text-white flex items-center justify-between">
          <div>Hỗ trợ khách hàng</div>
          <button onClick={onClose}>Đóng</button>
        </div>

        <div className="p-3 flex-1 overflow-y-auto space-y-3">
          {messages && messages.length === 0 && (
            <div className="text-gray-500">Chưa có tin nhắn</div>
          )}

          {messages &&
            messages.map((m) => (
              <div key={m.id || m._id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-2 rounded ${m.from === "user" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
                  {m.content || m.message}
                  <div className="text-xs text-gray-400 mt-1">{new Date(m.createdAt || m.timestamp).toLocaleString()}</div>
                </div>
              </div>
            ))}
          <div ref={endRef} />
        </div>

        <div className="p-3 border-t flex items-center gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 p-2 border rounded" placeholder="Nhập tin nhắn..." />
          <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded">Gửi</button>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;

