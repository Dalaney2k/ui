import React from "react";
import { Heart, ShoppingCart, User } from "lucide-react";

const ActionButtons = ({
  isScrolled = false,
  cartItems = [],
  wishlistCount = 0,
  openCart = () => {},
  setShowWishlist = () => {},
  setIsUserMenuOpen = () => {},
  isUserMenuOpen = false,
}) => {
  return (
    <div className={`actions-section${isScrolled ? " scrolled" : ""}`}>
      {/* Wishlist */}
      <div className={`action-button-wrapper${isScrolled ? " scrolled" : ""}`}>
        <button onClick={() => setShowWishlist(true)} className="action-button">
          <Heart size={22} className="action-icon" />
          {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
        </button>
      </div>

      {/* Cart */}
      <button
        className={`action-button${isScrolled ? " scrolled" : ""}`}
        onClick={openCart}
      >
        <ShoppingCart size={22} className="action-icon" />
        {cartItems.length > 0 && (
          <span className="badge">{cartItems.length}</span>
        )}
      </button>

      {/* User Menu */}
      <div className={`action-button-wrapper${isScrolled ? " scrolled" : ""}`}>
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="action-button"
          id="user-menu-trigger"
        >
          <User size={22} className="action-icon user-icon" />
        </button>
      </div>

      <style jsx>{`
        .actions-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }
        .action-button-wrapper {
          position: relative;
        }
        .action-button {
          position: relative;
          padding: 0.75rem;
          border-radius: 50%;
          border: 1.5px solid rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.92);
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .action-button:hover {
          transform: scale(1.05);
          background: rgba(243, 244, 246, 0.96);
          border-color: rgba(239, 68, 68, 0.2);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
        }
        .action-icon {
          color: #374151;
          transition: all 0.15s ease;
        }
        .action-button:hover .action-icon {
          color: #ef4444;
          transform: scale(1.1);
        }
        .action-button:hover .user-icon {
          color: #3b82f6;
        }
        .badge {
          position: absolute;
          top: -3px;
          right: -3px;
          width: 22px !important;
          height: 22px !important;
          border-radius: 50% !important;
          border: 2px solid white;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 12px !important;
          font-weight: 600;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          box-shadow: 0 2px 6px rgba(239, 68, 68, 0.3);
        }
        @media (max-width: 768px) {
          .actions-section {
            gap: 0.3rem;
          }
          .action-button,
          .action-button-wrapper {
            padding: 0.5rem;
            min-width: 36px;
            min-height: 36px;
          }
          .badge {
            width: 18px !important;
            height: 18px !important;
            font-size: 10px !important;
          }
        }
        @media (max-width: 480px) {
          .action-button,
          .action-button-wrapper {
            min-width: 32px;
            min-height: 32px;
            padding: 0.3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ActionButtons;
