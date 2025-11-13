import React, { useState } from "react";
import ProductFilters from "../admin/components/ProductFilters.jsx";

const ProductFiltersDemo = () => {
  const [filters, setFilters] = useState({
    search: "",
    pageSize: 20,
    tag: "",
    category: "",
    brand: "",
    status: "",
    priceMin: "",
    priceMax: "",
    updatedSince: "",
    sortBy: "newest",
  });

  const [loading] = useState(false);

  // Mock stats data
  const stats = {
    total: 1234,
    active: 890,
    inactive: 234,
    outOfStock: 89,
    featured: 156,
    new: 45,
    filtered: 1234,
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    console.log("Filters changed:", newFilters);
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      pageSize: 20,
      tag: "",
      category: "",
      brand: "",
      status: "",
      priceMin: "",
      priceMax: "",
      updatedSince: "",
      sortBy: "newest",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          🔧 Demo - Bộ Lọc Sản Phẩm Admin
        </h1>

        <ProductFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          stats={stats}
          loading={loading}
          onClearFilters={clearAllFilters}
        />

        {/* Mock results display */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-3">
            Current Filters State:
          </h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
            {JSON.stringify(filters, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ProductFiltersDemo;
