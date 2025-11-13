import React, { useState, useEffect } from "react";

const CategoriesShowcase = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Color mapping cho từng category
  const colorMapping = {
    1: "from-green-400 to-emerald-500", // Food & Beverages
    2: "from-pink-400 to-rose-500", // Beauty & Health
    3: "from-purple-400 to-violet-500", // Fashion
    4: "from-blue-400 to-indigo-500", // Electronics
    5: "from-yellow-400 to-orange-500", // Home & Living
  };

  // Vietnamese translation mapping
  const vietnameseNames = {
    "Food & Beverages": "Thực Phẩm & Đồ Uống",
    "Beauty & Health": "Mỹ Phẩm & Skincare",
    Fashion: "Thời Trang & Phụ Kiện",
    Electronics: "Điện Tử & Gia Dụng",
    "Home & Living": "Nhà Cửa & Đời Sống",
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("https://localhost:8080/api/category");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        // Lấy 4 categories đầu tiên
        const firstFourCategories = result.data.slice(0, 4);
        setCategories(firstFourCategories);
      } else {
        throw new Error(result.message || "Failed to fetch categories");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data ngay khi component mount
    fetchCategories();

    // Set up auto refresh mỗi 10 phút (600000ms)
    const intervalId = setInterval(() => {
      fetchCategories();
    }, 10 * 60 * 1000);

    // Cleanup interval khi component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const getProductCountText = (count) => {
    return count > 0 ? `${count}+ sản phẩm` : "Sắp ra mắt";
  };

  const getVietnameseName = (englishName) => {
    return vietnameseNames[englishName] || englishName;
  };

  const getVietnameseDescription = (englishName) => {
    const descriptions = {
      "Food & Beverages": "Hương vị authentic từ Nhật",
      "Beauty & Health": "Chăm sóc da theo chuẩn Nhật",
      Fashion: "Style Nhật thanh lịch",
      Electronics: "Công nghệ tiên tiến Nhật Bản",
      "Home & Living": "Không gian sống Nhật Bản",
    };
    return descriptions[englishName] || "Sản phẩm chất lượng từ Nhật";
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Khám Phá Danh Mục Sản Phẩm
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Từ mỹ phẩm đến công nghệ, chúng tôi có đầy đủ những gì bạn cần từ
              Nhật Bản
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 rounded-3xl h-48 mb-4"></div>
                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 h-3 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Khám Phá Danh Mục Sản Phẩm
            </h2>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
              <p className="font-bold">Lỗi tải dữ liệu!</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Khám Phá Danh Mục Sản Phẩm
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Từ mỹ phẩm đến công nghệ, chúng tôi có đầy đủ những gì bạn cần từ
            Nhật Bản
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="group cursor-pointer">
              <div className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x200/e5e7eb/6b7280?text=No+Image";
                  }}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${
                    colorMapping[category.id] || "from-gray-400 to-gray-500"
                  } opacity-80`}
                ></div>

                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                  <h3 className="font-bold text-xl mb-2">
                    {getVietnameseName(category.name)}
                  </h3>
                  <p className="text-sm opacity-90 mb-1">
                    {getVietnameseDescription(category.name)}
                  </p>
                  <p className="text-sm font-medium">
                    {getProductCountText(category.productCount)}
                  </p>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="bg-white text-gray-800 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors">
                    Xem Ngay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesShowcase;
