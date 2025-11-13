import React from "react";
import HeroSection from "../components/Layout/HeroSection.jsx";
import Newsletter from "../components/Layout/Newsletter.jsx";
import FeaturedProducts from "../components/Product/FeaturedProducts.jsx";
import TestimonialsSection from "../components/Layout/TestimonialsSection.jsx";
import BrandStorySection from "../components/Layout/BrandStorySection.jsx";
import CategoriesShowcase from "../components/Layout/CategoriesShowcase.jsx";
import TrustBadges from "../components/Layout/TrustBadges.jsx";

const Home = ({
  addToCart,
  toggleWishlist,
  wishlistItems,
  isInWishlist,
  onQuickView,
  onNotification,
}) => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products */}
      <FeaturedProducts
        addToCart={addToCart}
        toggleWishlist={toggleWishlist}
        wishlistItems={wishlistItems}
        isInWishlist={isInWishlist}
        onQuickView={onQuickView}
        onNotification={onNotification}
      />

      {/* Categories Showcase - Hiển thị các danh mục sản phẩm */}
      <CategoriesShowcase />

      {/* Brand Story - Câu chuyện thương hiệu */}
      <BrandStorySection />

      {/* Testimonials - Đánh giá khách hàng */}
      <TestimonialsSection />

      {/* Trust Badges - Huy hiệu tin cậy */}
      <TrustBadges />

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
};

export default Home;
