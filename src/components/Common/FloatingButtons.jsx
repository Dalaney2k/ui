// components/Common/FloatingButtons.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ChevronUp, MessageCircle, Share2 } from "lucide-react";

const FloatingButtons = ({
  showQuickActions = false,
  onMessageClick = null,
  onShareClick = null,
}) => {
  const [isScrollVisible, setIsScrollVisible] = useState(false);
  const location = useLocation(); // Thêm hook này để theo dõi route changes

  // Show scroll button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsScrollVisible(true);
      } else {
        setIsScrollVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleShare = async () => {
    if (onShareClick) {
      onShareClick();
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          text: "Xem sản phẩm này:",
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert("Đã copy link vào clipboard!");
      }
    } catch (error) {
      // User cancelled share or clipboard failed
      if (error.name !== "AbortError") {
        console.error("Share failed:", error);
      }
    }
  };

  const handleMessage = () => {
    if (onMessageClick) {
      onMessageClick();
      return;
    }

    // Open contact/support chat
    const phone = "0123456789"; // Số điện thoại của shop
    const message = `Xin chào! Tôi quan tâm đến sản phẩm: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
      message
    )}`;

    // Thử mở WhatsApp, nếu không có thì mở SMS
    try {
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      window.location.href = `sms:${phone}?body=${encodeURIComponent(message)}`;
    }
  };

  // Tính toán showQuickActions dựa trên current location
  const shouldShowQuickActions = location.pathname.includes("/product/");

  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-4 ">
      {/* Quick Actions - chỉ hiện ở trang chi tiết */}
      {shouldShowQuickActions && (
        <>
          <button
            onClick={handleMessage}
            className="bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-300 border border-gray-200 hover:scale-105"
          >
            <MessageCircle className="text-blue-600" size={24} />
          </button>
          <button
            onClick={handleShare}
            className="bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-300 border border-gray-200 hover:scale-105"
          >
            <Share2 className="text-gray-600" size={24} />
          </button>
        </>
      )}

      {/* Scroll to top - hiện ở mọi trang khi scroll */}
      {isScrollVisible && (
        <button
          onClick={scrollToTop}
          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          title="Lên đầu trang"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default FloatingButtons;
