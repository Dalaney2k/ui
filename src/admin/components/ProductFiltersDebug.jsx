import React from "react";

const ProductFiltersDebug = ({ filters, stats }) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <h4 className="font-bold text-yellow-800 mb-2">🐛 Debug Info</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h5 className="font-semibold text-yellow-700 mb-1">
            Current Filters:
          </h5>
          <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-32">
            {JSON.stringify(filters, null, 2)}
          </pre>
        </div>

        <div>
          <h5 className="font-semibold text-yellow-700 mb-1">Stats:</h5>
          <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-32">
            {JSON.stringify(stats, null, 2)}
          </pre>
        </div>
      </div>

      <div className="mt-2">
        <h5 className="font-semibold text-yellow-700 mb-1">
          Quick Filter Logic:
        </h5>
        <div className="text-xs">
          <p>Status: {filters.status || "none"}</p>
          <p>InStock: {String(filters.inStock)}</p>
          <p>IsFeatured: {String(filters.isFeatured)}</p>
          <p>IsNew: {String(filters.isNew)}</p>
          <p>Search: {filters.search || "none"}</p>
          <p>Category: {filters.categoryId || filters.category || "none"}</p>
          <p>Brand: {filters.brandId || filters.brand || "none"}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductFiltersDebug;
