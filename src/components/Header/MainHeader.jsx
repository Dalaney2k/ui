import React, { useState, useEffect } from "react";
import TopBar from "./TopBar.jsx";
import Logo from "./Logo.jsx";
import SearchBar from "./SearchBar.jsx";
import ActionButtons from "./ActionButtons.jsx";
import Navigation from "./Navigation.jsx";
import WishlistModal from "../Wishlist/WishlistModal.jsx";
import UserMenu from "../Auth/UserMenu.jsx";

// UserMenu Portal Component
const UserMenuPortal = (props) => {
  const [position, setPosition] = useState(null);

  const calculatePosition = React.useCallback(() => {
    const button = document.getElementById("user-menu-trigger");
    if (button) {
      const rect = button.getBoundingClientRect();
      return {
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      };
    }
    return null;
  }, []);

  React.useEffect(() => {
    const initialPosition = calculatePosition();
    setPosition(initialPosition);

    const updatePosition = () => {
      const newPosition = calculatePosition();
      setPosition(newPosition);
    };

    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [calculatePosition]);

  if (!position) return null;

  return (
    <div
      className="user-menu-portal"
      style={{
        position: "fixed",
        top: `${position.top}px`,
        right: `${position.right}px`,
        zIndex: 999999,
      }}
    >
      <UserMenu {...props} />
    </div>
  );
};

function MainHeader({
  cartItems = [],
  wishlistItems = [],
  wishlistCount = 0,
  openCart = () => {},
  user = null,
  isUserMenuOpen = false,
  setIsUserMenuOpen = () => {},
  setIsLoginModalOpen = () => {},
  setIsSignupModalOpen = () => {},
  handleLogout = () => {},
  addToCart = () => {},
  toggleWishlist = () => {},
  onQuickView = () => {},
}) {
  // State management
  const [showWishlist, setShowWishlist] = useState(false);
  const [isTopBarVisible, setIsTopBarVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      if (currentScrollY === 0) {
        setIsTopBarVisible(true);
      } else if (currentScrollY > 20) {
        setIsTopBarVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="header-wrapper">
        {/* TOP BAR */}
        <TopBar isVisible={isTopBarVisible} />

        {/* MAIN HEADER */}
        <header className="main-header">
          <div className="container mx-auto px-4">
            <div className={`header-content${isScrolled ? " scrolled" : ""}`}>
              <Logo isScrolled={isScrolled} />
              <SearchBar isScrolled={isScrolled} />
              <ActionButtons
                isScrolled={isScrolled}
                cartItems={cartItems}
                wishlistCount={wishlistCount}
                openCart={openCart}
                setShowWishlist={setShowWishlist}
                setIsUserMenuOpen={setIsUserMenuOpen}
                isUserMenuOpen={isUserMenuOpen}
              />
            </div>
          </div>
          <Navigation />
        </header>
      </div>

      {/* UserMenu Portal */}
      {isUserMenuOpen && (
        <UserMenuPortal
          isOpen={isUserMenuOpen}
          user={user}
          onClose={() => setIsUserMenuOpen(false)}
          setIsLoginModalOpen={setIsLoginModalOpen}
          setIsSignupModalOpen={setIsSignupModalOpen}
          handleLogout={handleLogout}
        />
      )}

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={showWishlist}
        onClose={() => setShowWishlist(false)}
        wishlistItems={wishlistItems}
        addToCart={addToCart}
        removeFromWishlist={toggleWishlist}
        onQuickView={onQuickView}
      />

      <style jsx>{`
        .header-wrapper {
          position: sticky;
          top: 0;
          z-index: 50;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .main-header {
          background-color: rgba(255, 255, 255, 0.95);
          border-bottom: 1px solid rgba(229, 231, 235, 0.5);
        }
        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 16px 0;
          min-height: 80px;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .user-menu-portal {
          pointer-events: auto;
          z-index: 999999;
        }
        @media (max-width: 768px) {
          .header-wrapper {
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
          }
          .main-header {
            border-bottom: none;
          }
          .header-content {
            gap: 0.5rem;
            padding: 10px 0;
            min-height: 56px;
          }
        }
        @media (max-width: 480px) {
          .header-content {
            min-height: 48px;
            padding: 6px 0;
          }
        }
      `}</style>
    </>
  );
}

export default MainHeader;
