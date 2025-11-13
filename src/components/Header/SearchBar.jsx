import React, { useState, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { productService } from "../../services";

const SearchBar = ({ isScrolled = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchTimeoutRef = useRef(null);

  // DEBOUNCED SEARCH
  const handleSearchChange = useCallback(async (value) => {
    setSearchValue(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim().length >= 2) {
      setIsSearching(true);

      searchTimeoutRef.current = setTimeout(async () => {
        try {
          // Sử dụng searchProducts với endpoint mới
          const response = await productService.searchProducts(value.trim(), {
            pageSize: 5,
            sortBy: "relevance",
          });
          setSearchSuggestions(response.products || []);
        } catch (error) {
          console.error("Search suggestions error:", error);
          setSearchSuggestions([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setSearchSuggestions([]);
      setIsSearching(false);
    }
  }, []);

  // SEARCH SUBMIT HANDLER
  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (searchValue.trim()) {
        navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
        setIsSearchFocused(false);
        setSearchSuggestions([]);
      }
    },
    [searchValue, navigate]
  );

  // Ẩn search bar trên trang products
  if (location.pathname === "/products") {
    return null;
  }

  return (
    <div className={`search-section${isScrolled ? " scrolled" : ""}`}>
      <div className="search-container">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit(e)}
          className="search-input"
        />
        <Search
          size={20}
          className={`search-icon ${isSearchFocused ? "focused" : ""}`}
        />
        {searchValue && (
          <button onClick={() => setSearchValue("")} className="search-clear">
            <X size={16} />
          </button>
        )}
      </div>

      <style jsx>{`
        .search-section {
          flex: 1;
          max-width: 600px;
          margin: 0 2rem;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .search-section.scrolled {
          transform: scale(0.85);
        }
        .search-container {
          position: relative;
          width: 100%;
        }
        .search-input {
          width: 100%;
          padding: 12px 3rem 12px 3rem;
          border: 2px solid #e5e7eb;
          border-radius: 9999px;
          font-size: 16px;
          color: #111827;
          background: rgba(255, 255, 255, 0.96);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
        }
        .search-input:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
          background: rgba(255, 255, 255, 1);
        }
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          transition: color 0.2s ease;
          pointer-events: none;
        }
        .search-icon.focused {
          color: #ef4444;
        }
        .search-clear {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 50%;
          transition: all 0.15s ease;
        }
        .search-clear:hover {
          color: #6b7280;
          background-color: rgba(243, 244, 246, 0.8);
          transform: translateY(-50%) scale(1.1);
        }
        @media (max-width: 768px) {
          .search-section {
            max-width: 100vw;
            margin: 0 0.5rem;
            flex: 1 1 100%;
            display: block;
            transform: scale(1) !important;
          }
          .search-input {
            font-size: 14px;
            padding: 8px 2.5rem 8px 2.5rem;
          }
        }
        @media (max-width: 480px) {
          .search-input {
            font-size: 13px;
            padding: 6px 2rem 6px 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
