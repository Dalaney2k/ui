import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Package, Info, MessageCircle, Newspaper } from "lucide-react";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { id: "home", name: "Trang chủ", icon: Home, path: "/" },
    { id: "products", name: "Sản phẩm", icon: Package, path: "/products" },
    { id: "about", name: "Giới thiệu", icon: Info, path: "/about" },
    { id: "contact", name: "Liên hệ", icon: MessageCircle, path: "/contact" },
    { id: "news", name: "Tin tức", icon: Newspaper, path: "/news" },
  ];

  return (
    <nav className="navigation">
      <div className="container mx-auto px-4">
        <div className="nav-content">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`nav-button ${isActive ? "active" : ""}`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .navigation {
          background: rgba(255, 255, 255, 0.98);
          border-top: 1px solid rgba(229, 231, 235, 0.5);
          position: relative;
          z-index: 1;
        }
        .nav-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          padding: 12px 0;
        }
        .nav-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 8px 16px;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          color: #374151;
          background: rgba(255, 255, 255, 0.6);
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-button:hover {
          background: rgba(243, 244, 246, 0.85);
          color: #111827;
          transform: scale(1.03);
        }
        .nav-button.active {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          box-shadow: 0 3px 10px rgba(239, 68, 68, 0.25);
        }
        .nav-button:active {
          transform: scale(0.97);
        }
        @media (max-width: 768px) {
          .nav-content {
            gap: 0.3rem;
            padding: 8px 0;
            flex-wrap: nowrap;
            overflow-x: auto;
          }
          .nav-button span {
            display: none;
          }
          .nav-button {
            padding: 0.5rem;
            border-radius: 50%;
            font-size: 0;
            min-width: 36px;
            min-height: 36px;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;
