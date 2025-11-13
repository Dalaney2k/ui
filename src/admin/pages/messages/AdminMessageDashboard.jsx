import React, { useEffect, useState } from "react";
import messageService from "../../../services/messageService";

const AdminMessageDashboard = () => {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const res = await messageService.adminGetConversations();
      if (res?.success) setConversations(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openConversation = async (conv) => {
    setSelected(conv);
    try {
      const res = await messageService.adminGetConversationMessages(conv.id || conv._id);
      if (res?.success) setMessages(res.data?.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  const sendReply = async () => {
    if (!selected) return;
    if (!reply.trim()) return;
    try {
      const res = await messageService.adminSendReply(selected.id || selected._id, { content: reply.trim() });
      if (res?.success) {
        // refresh messages
        await openConversation(selected);
        setReply("");
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Gửi phản hồi thất bại");
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Quản lý tin nhắn khách hàng</h1>
        <p className="page-subtitle">Danh sách các cuộc hội thoại và phản hồi</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1 bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Conversations</h3>
          {loading && <div>Đang tải...</div>}
          {!loading && conversations.length === 0 && <div>Không có cuộc hội thoại</div>}
          <ul className="space-y-2">
            {conversations.map((c) => (
              <li key={c.id || c._id}>
                <button
                  className={`w-full text-left p-2 rounded hover:bg-gray-100 ${selected && (selected.id === c.id || selected._id === c._id) ? 'bg-gray-100' : ''}`}
                  onClick={() => openConversation(c)}
                >
                  <div className="font-medium">{c.user?.email || c.user?.name || `User ${c.userId || c.user?.id}`}</div>
                  <div className="text-xs text-gray-500">{c.lastMessagePreview || c.lastMessage || "-"}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-3 bg-white p-4 rounded shadow flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4">
            {!selected && <div className="text-gray-500">Chọn một cuộc hội thoại để xem chi tiết</div>}
            {selected && (
              <div>
                <h3 className="font-semibold">Cuộc hội thoại với {selected.user?.email || selected.user?.name}</h3>
                <div className="mt-3 space-y-3">
                  {messages.map((m) => (
                    <div key={m.id || m._id} className={`${m.from === 'admin' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block p-3 rounded ${m.from === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                        <div className="text-sm">{m.content || m.message}</div>
                        <div className="text-xs text-gray-300 mt-1">{new Date(m.createdAt || m.timestamp).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {selected && (
            <div className="pt-2 border-t">
              <div className="flex gap-2">
                <input value={reply} onChange={(e) => setReply(e.target.value)} className="flex-1 p-2 border rounded" placeholder="Nhập phản hồi" />
                <button onClick={sendReply} className="bg-blue-600 text-white px-4 py-2 rounded">Gửi</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessageDashboard;
