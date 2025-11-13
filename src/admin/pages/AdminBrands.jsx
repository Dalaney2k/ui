import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  Image,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Upload,
  Download,
  Tag,
} from "lucide-react";
import { adminBrandService, formatDate } from "../services/AdminApiService.js";

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Brand Form Modal Component
const BrandFormModal = ({ brand, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    website: "",
    country: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name || "",
        description: brand.description || "",
        logo: brand.logo || "",
        website: brand.website || "",
        country: brand.country || "",
        status: brand.status || "active",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        logo: "",
        website: "",
        country: "",
        status: "active",
      });
    }
    setErrors({});
  }, [brand, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      let response;
      if (brand) {
        response = await adminBrandService.updateBrand(brand.id, formData);
      } else {
        response = await adminBrandService.createBrand(formData);
      }

      if (response.success) {
        onSave(response.data);
        onClose();
      } else {
        if (response.errors) {
          setErrors(response.errors);
        } else {
          setErrors({ general: response.message || "Có lỗi xảy ra" });
        }
      }
    } catch (error) {
      console.error("Error saving brand:", error);
      setErrors({ general: "Có lỗi xảy ra khi lưu thương hiệu" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {brand ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Brand Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên thương hiệu *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`input ${errors.name ? "border-red-500" : ""}`}
                placeholder="Nhập tên thương hiệu"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quốc gia
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
                className={`input ${errors.country ? "border-red-500" : ""}`}
                placeholder="Nhập quốc gia"
              />
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
              )}
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleChange("website", e.target.value)}
                className={`input ${errors.website ? "border-red-500" : ""}`}
                placeholder="https://example.com"
              />
              {errors.website && (
                <p className="mt-1 text-sm text-red-600">{errors.website}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="select"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo URL
            </label>
            <input
              type="url"
              value={formData.logo}
              onChange={(e) => handleChange("logo", e.target.value)}
              className={`input ${errors.logo ? "border-red-500" : ""}`}
              placeholder="https://example.com/logo.png"
            />
            {errors.logo && (
              <p className="mt-1 text-sm text-red-600">{errors.logo}</p>
            )}
            {formData.logo && (
              <div className="mt-2">
                <img
                  src={formData.logo}
                  alt="Logo preview"
                  className="h-16 w-16 object-contain border border-gray-200 rounded"
                  onError={(e) => {
                    e.target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyNEM0MCAyNCA0MCAzMiA0MCAzMkM0MCA0MCAzMiA0MCAzMiA0MEMyNCA0MCAyNCAzMiAyNCAzMkMyNCAyNCAzMiAyNCAzMiAyNFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                  }}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              className={`textarea ${
                errors.description ? "border-red-500" : ""
              }`}
              placeholder="Nhập mô tả về thương hiệu..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>{brand ? "Cập nhật" : "Thêm mới"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminBrands = () => {
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    sortBy: "name",
  });

  // Modal states
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  // Debounce search
  const debouncedSearch = useDebounce(filters.search, 500);

  // Status options
  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "active", label: "Hoạt động" },
    { value: "inactive", label: "Không hoạt động" },
  ];

  // Sort options
  const sortOptions = [
    { value: "name", label: "Tên A-Z" },
    { value: "name_desc", label: "Tên Z-A" },
    { value: "created_desc", label: "Mới nhất" },
    { value: "created_asc", label: "Cũ nhất" },
  ];

  // Fetch brands
  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        status: filters.status,
        sortBy: filters.sortBy,
      };

      // Remove empty params
      Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] === null) {
          delete params[key];
        }
      });

      const response = await adminBrandService.getBrands(params);

      console.log("🔍 [DEBUG] Brand response:", response);
      console.log("🔍 [DEBUG] Brand data:", response.data);

      if (response.success) {
        const brandsData = response.data.brands || response.data.items || [];
        console.log("🔍 [DEBUG] Setting brands:", brandsData);
        setBrands(brandsData);
        setPagination((prev) => ({
          ...prev,
          totalItems:
            response.data.pagination?.totalItems ||
            response.data.totalCount ||
            0,
          totalPages:
            response.data.pagination?.totalPages ||
            Math.ceil((response.data.totalCount || 0) / pagination.pageSize) ||
            1,
        }));
      } else {
        setError(response.message || "Không thể tải danh sách thương hiệu");
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      setError("Có lỗi xảy ra khi tải danh sách thương hiệu");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, debouncedSearch, filters]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: parseInt(newPageSize),
      page: 1,
    }));
  };

  // Handle brand selection
  const handleBrandSelection = (brandId) => {
    setSelectedBrands((prev) => {
      if (prev.includes(brandId)) {
        return prev.filter((id) => id !== brandId);
      } else {
        return [...prev, brandId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedBrands.length === brands.length) {
      setSelectedBrands([]);
    } else {
      setSelectedBrands(brands.map((brand) => brand.id));
    }
  };

  // Handle brand operations
  const handleAddBrand = () => {
    setEditingBrand(null);
    setShowBrandModal(true);
  };

  const handleEditBrand = (brand) => {
    setEditingBrand(brand);
    setShowBrandModal(true);
  };

  const handleSaveBrand = () => {
    fetchBrands(); // Refresh brands list
  };

  const handleDeleteBrand = async (brandId) => {
    if (!confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) {
      return;
    }

    try {
      const response = await adminBrandService.deleteBrand(brandId);
      if (response.success) {
        fetchBrands();
        setSelectedBrands((prev) => prev.filter((id) => id !== brandId));
      } else {
        alert(response.message || "Không thể xóa thương hiệu");
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
      alert("Có lỗi xảy ra khi xóa thương hiệu");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBrands.length === 0) return;

    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa ${selectedBrands.length} thương hiệu đã chọn?`
      )
    ) {
      return;
    }

    try {
      const response = await adminBrandService.deleteBrands(selectedBrands);
      if (response.success) {
        fetchBrands();
        setSelectedBrands([]);
      } else {
        alert(response.message || "Không thể xóa các thương hiệu đã chọn");
      }
    } catch (error) {
      console.error("Error bulk deleting brands:", error);
      alert("Có lỗi xảy ra khi xóa các thương hiệu");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2">
              <Tag className="w-6 h-6 text-primary" />
              Quản lý thương hiệu
            </h1>
            <p className="page-subtitle">
              Quản lý thông tin các thương hiệu sản phẩm
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchBrands()}
              className="btn btn-outline"
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Làm mới
            </button>
            <button onClick={handleAddBrand} className="btn btn-primary">
              <Plus className="w-4 h-4" />
              Thêm thương hiệu
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tìm kiếm
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tên thương hiệu..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="select"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sắp xếp
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="select"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Page Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hiển thị
              </label>
              <select
                value={pagination.pageSize}
                onChange={(e) => handlePageSizeChange(e.target.value)}
                className="select"
              >
                <option value="10">10 kết quả</option>
                <option value="20">20 kết quả</option>
                <option value="50">50 kết quả</option>
                <option value="100">100 kết quả</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      {selectedBrands.length > 0 && (
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Đã chọn {selectedBrands.length} thương hiệu
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkDelete}
                  className="btn btn-outline btn-sm text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa đã chọn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Brands Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">
            Danh sách thương hiệu
          </h3>
        </div>

        <div className="card-content p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Không có thương hiệu
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Không tìm thấy thương hiệu nào phù hợp với bộ lọc.
              </p>
              <div className="mt-4">
                <button
                  onClick={handleAddBrand}
                  className="btn btn-primary btn-sm"
                >
                  <Plus className="w-4 h-4" />
                  Thêm thương hiệu đầu tiên
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={
                            selectedBrands.length === brands.length &&
                            brands.length > 0
                          }
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Logo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên thương hiệu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quốc gia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sản phẩm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày tạo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {brands.map((brand) => (
                      <tr key={brand.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand.id)}
                            onChange={() => handleBrandSelection(brand.id)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-10 w-10 flex-shrink-0">
                            {brand.logo ? (
                              <img
                                className="h-10 w-10 object-contain border border-gray-200 rounded"
                                src={brand.logo}
                                alt={brand.name}
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className="h-10 w-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center"
                              style={{ display: brand.logo ? "none" : "flex" }}
                            >
                              <Image className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {brand.name}
                          </div>
                          {brand.website && (
                            <div className="text-sm text-gray-500">
                              <a
                                href={brand.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary"
                              >
                                {brand.website}
                              </a>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {brand.country || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              brand.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {brand.status === "active"
                              ? "Hoạt động"
                              : "Không hoạt động"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {brand.productCount || 0} sản phẩm
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(brand.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditBrand(brand)}
                              className="text-primary hover:text-primary-dark"
                              title="Chỉnh sửa"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBrand(brand.id)}
                              className="text-red-600 hover:text-red-700"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Hiển thị{" "}
                      <span className="font-medium">
                        {(pagination.page - 1) * pagination.pageSize + 1}
                      </span>{" "}
                      đến{" "}
                      <span className="font-medium">
                        {Math.min(
                          pagination.page * pagination.pageSize,
                          pagination.totalItems
                        )}
                      </span>{" "}
                      trong tổng số{" "}
                      <span className="font-medium">
                        {pagination.totalItems}
                      </span>{" "}
                      kết quả
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="btn btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Trước
                      </button>
                      <span className="text-sm text-gray-700">
                        Trang {pagination.page} / {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        className="btn btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sau
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Brand Form Modal */}
      <BrandFormModal
        brand={editingBrand}
        isOpen={showBrandModal}
        onClose={() => setShowBrandModal(false)}
        onSave={handleSaveBrand}
      />
    </div>
  );
};

export default AdminBrands;
