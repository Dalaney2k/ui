import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Danh sách các trang muốn scroll về đầu (theo routes của bạn)
    const scrollToTopPages = [
      "/products", // Trang sản phẩm
      "/about", // Trang giới thiệu
      "/profile", // Trang profile
      // Bạn có thể thêm '/product/' nếu muốn detail page cũng scroll về đầu
      // hoặc bỏ '/' nếu muốn trang home cũng scroll về đầu
    ];

    // Kiểm tra route hiện tại có trong danh sách không
    const shouldScrollToTop = scrollToTopPages.some(
      (page) => pathname === page || pathname.startsWith(page)
    );

    if (shouldScrollToTop) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }

    // Với routes không trong danh sách sẽ giữ nguyên vị trí scroll
  }, [pathname]);

  return null;
}

export default ScrollToTop;
