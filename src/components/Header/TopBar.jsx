import React from "react";
import { Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";

const TopBar = ({ isVisible = true }) => {
  return (
    <div className={`top-bar ${isVisible ? "fade-in-down" : "fade-out"}`}>
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center text-sm text-white">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 hover:text-red-200 transition-colors">
              <Phone size={14} />
              <span>1900-1234</span>
            </div>
            <div className="hidden md:flex items-center space-x-2 hover:text-red-200 transition-colors">
              <Mail size={14} />
              <span>info@sakurahome.vn</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <a
              href="https://www.facebook.com/nguyen.thanh.at.688733/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-200 transition-all duration-200 hover:scale-110"
            >
              <Facebook size={16} />
            </a>
            <Instagram
              size={16}
              className="hover:text-red-200 transition-all duration-200 hover:scale-110"
            />
            <Youtube
              size={16}
              className="hover:text-red-200 transition-all duration-200 hover:scale-110"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .top-bar {
          height: 36px;
          opacity: 1;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.6s,
            transform 0.6s cubic-bezier(0.4, 0, 0.2, 1),
            height 0.6s cubic-bezier(0.4, 0, 0.2, 1),
            filter 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .top-bar.fade-in-down {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
          height: 36px;
          filter: blur(0px);
        }
        .top-bar.fade-out {
          opacity: 0;
          visibility: hidden;
          transform: translateY(-16px);
          height: 0;
          overflow: hidden;
          filter: blur(8px);
        }
      `}</style>
    </div>
  );
};

export default TopBar;
