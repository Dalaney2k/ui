import React from "react";
import { useNavigate } from "react-router-dom";

const Logo = ({ isScrolled = false }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`logo-section${isScrolled ? " scrolled" : ""}`}
      onClick={() => navigate("/")}
    >
      <div className="logo-image">
        <img
          src="/assets/sakura-home.svg"
          alt="Sakura Home"
          style={{ width: "64px", height: "64px" }}
        />
      </div>
      <div className="logo-text">
        <h1 className="logo-title">Sakura Home</h1>
        <p className="logo-subtitle">Đồ Nhật Chính Hãng</p>
      </div>

      <style jsx>{`
        .logo-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .logo-section:hover {
          transform: scale(1.02);
        }
        .logo-image {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        .logo-title {
          font-family: "Otsutome", sans-serif;
          font-weight: 700;
          color: #1f2937;
          font-size: 30px;
          line-height: 1.2;
          margin: 0;
          transition: font-size 0.3s;
        }
        .logo-subtitle {
          color: #6b7280;
          font-size: 14px;
          line-height: 1.2;
          margin: 0;
          opacity: 1;
        }
        @media (max-width: 768px) {
          .logo-section {
            gap: 0.5rem;
          }
          .logo-image {
            width: 40px;
            height: 40px;
          }
          .logo-image img {
            width: 40px;
            height: 40px;
          }
          .logo-title {
            display: none;
          }
          .logo-subtitle {
            display: none;
          }
        }
        @media (max-width: 480px) {
          .logo-image {
            width: 32px;
            height: 32px;
          }
          .logo-image img {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </div>
  );
};

export default Logo;
