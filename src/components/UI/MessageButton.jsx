import React from "react";
import { MessageCircle } from "lucide-react";

const MessageButton = ({ onClick }) => {
	return (
		<button
			onClick={onClick}
			className="bg-white shadow rounded-full p-3 border border-gray-200 hover:shadow-lg"
			title="Nhắn tin hỗ trợ"
		>
			<MessageCircle className="text-blue-600" size={20} />
		</button>
	);
};

export default MessageButton;

