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
  FolderTree,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import {
  adminCategoryService,
  formatDate,
} from "../services/AdminApiService.js";

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

// Category Form Modal Component
const CategoryFormModal = ({
  category,
  parentCategories,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    parentId: "",
    status: "active",
    order: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        image: category.image || "",
        parentId: category.parentId || "",
        status: category.status || "active",
        order: category.order || 0,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        image: "",
        parentId: "",
        status: "active",
        order: 0,
      });
    }
    setErrors({});
  }, [category, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      let response;
      if (category) {
        response = await adminCategoryService.updateCategory(
          category.id,
          formData
        );
      } else {
        response = await adminCategoryService.createCategory(formData);
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
      console.error("Error saving category:", error);
      setErrors({ general: "Có lỗi xảy ra khi lưu danh mục" });
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
            {category ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên danh mục *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`input ${errors.name ? "border-red-500" : ""}`}
                placeholder="Nhập tên danh mục"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Parent Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục cha
              </label>
              <select
                value={formData.parentId}
                onChange={(e) => handleChange("parentId", e.target.value)}
                className="select"
              >
                <option value="">-- Không có danh mục cha --</option>
                {parentCategories.map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.name}
                  </option>
                ))}
              </select>
              {errors.parentId && (
                <p className="mt-1 text-sm text-red-600">{errors.parentId}</p>
              )}
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thứ tự hiển thị
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  handleChange("order", parseInt(e.target.value) || 0)
                }
                className={`input ${errors.order ? "border-red-500" : ""}`}
                placeholder="0"
                min="0"
              />
              {errors.order && (
                <p className="mt-1 text-sm text-red-600">{errors.order}</p>
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

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hình ảnh URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => handleChange("image", e.target.value)}
              className={`input ${errors.image ? "border-red-500" : ""}`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image}</p>
            )}
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
                  alt="Image preview"
                  className="h-20 w-20 object-cover border border-gray-200 rounded"
                  onError={(e) => {
                    e.target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCAzMEM1MCAzMCA1MCA0MCA1MCA0MEM1MCA1MCA0MCA1MCA0MCA1MEMzMCA1MCAzMCA0MCAzMCA0MEMzMCAzMCA0MCAzMCA0MCAzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
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
              placeholder="Nhập mô tả về danh mục..."
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
                <>{category ? "Cập nhật" : "Thêm mới"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Category Tree Component
const CategoryTreeItem = ({
  category,
  level = 0,
  selectedCategories,
  onSelect,
  onEdit,
  onDelete,
  collapsed,
  onToggle,
}) => {
  const hasChildren = category.children && category.children.length > 0;
  const isCollapsed = collapsed[category.id];

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="checkbox"
            checked={selectedCategories.includes(category.id)}
            onChange={() => onSelect(category.id)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div
            className="flex items-center"
            style={{ paddingLeft: `${level * 24}px` }}
          >
            {hasChildren && (
              <button
                onClick={() => onToggle(category.id)}
                className="mr-2 p-1 hover:bg-gray-100 rounded"
              >
                {isCollapsed ? (
                  <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>
            )}
            <div className="flex items-center">
              <div className="h-8 w-8 flex-shrink-0 mr-3">
                {category.image ? (
                  <img
                    className="h-8 w-8 object-cover border border-gray-200 rounded"
                    src={category.image}
                    alt={category.name}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="h-8 w-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center"
                  style={{ display: category.image ? "none" : "flex" }}
                >
                  <Image className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {category.name}
                </div>
                {category.description && (
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {category.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              category.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {category.status === "active" ? "Hoạt động" : "Không hoạt động"}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {category.productCount || 0}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{category.order || 0}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {formatDate(category.createdAt)}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(category)}
              className="text-primary hover:text-primary-dark"
              title="Chỉnh sửa"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(category.id)}
              className="text-red-600 hover:text-red-700"
              title="Xóa"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
      {hasChildren &&
        !isCollapsed &&
        category.children.map((child) => (
          <CategoryTreeItem
            key={child.id}
            category={child}
            level={level + 1}
            selectedCategories={selectedCategories}
            onSelect={onSelect}
            onEdit={onEdit}
            onDelete={onDelete}
            collapsed={collapsed}
            onToggle={onToggle}
          />
        ))}
    </>
  );
};

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [flatCategories, setFlatCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [collapsed, setCollapsed] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 50,
    totalItems: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    parentId: "",
    sortBy: "order",
  });

  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

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
    { value: "order", label: "Thứ tự" },
    { value: "name", label: "Tên A-Z" },
    { value: "name_desc", label: "Tên Z-A" },
    { value: "created_desc", label: "Mới nhất" },
    { value: "created_asc", label: "Cũ nhất" },
  ];

  // Build tree structure
  const buildCategoryTree = (categories) => {
    const categoryMap = {};
    const rootCategories = [];

    // Create a map of all categories
    categories.forEach((category) => {
      categoryMap[category.id] = { ...category, children: [] };
    });

    // Build the tree structure
    categories.forEach((category) => {
      if (category.parentId && categoryMap[category.parentId]) {
        categoryMap[category.parentId].children.push(categoryMap[category.id]);
      } else {
        rootCategories.push(categoryMap[category.id]);
      }
    });

    return rootCategories;
  };

  // Note: flattenTree function removed as it's not used in the current tree implementation

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        status: filters.status,
        parentId: filters.parentId,
        sortBy: filters.sortBy,
      };

      // Remove empty params
      Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] === null) {
          delete params[key];
        }
      });

      const response = await adminCategoryService.getCategories(params);

      console.log("🔍 [DEBUG] Category response:", response);
      console.log("🔍 [DEBUG] Category data:", response.data);

      if (response.success) {
        const categoriesData =
          response.data.categories || response.data.items || [];
        console.log("🔍 [DEBUG] Setting categories:", categoriesData);
        const tree = buildCategoryTree(categoriesData);

        setCategories(tree);
        setFlatCategories(categoriesData);

        // Set parent categories (only root categories)
        setParentCategories(categoriesData.filter((cat) => !cat.parentId));

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
        setError(response.message || "Không thể tải danh sách danh mục");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Có lỗi xảy ra khi tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, debouncedSearch, filters]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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

  // Handle category selection
  const handleCategorySelection = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === flatCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(flatCategories.map((category) => category.id));
    }
  };

  // Handle tree collapse/expand
  const handleToggle = (categoryId) => {
    setCollapsed((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Handle category operations
  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = () => {
    fetchCategories(); // Refresh categories list
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      return;
    }

    try {
      const response = await adminCategoryService.deleteCategory(categoryId);
      if (response.success) {
        fetchCategories();
        setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
      } else {
        alert(response.message || "Không thể xóa danh mục");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Có lỗi xảy ra khi xóa danh mục");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCategories.length === 0) return;

    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa ${selectedCategories.length} danh mục đã chọn?`
      )
    ) {
      return;
    }

    try {
      const response = await adminCategoryService.deleteCategories(
        selectedCategories
      );
      if (response.success) {
        fetchCategories();
        setSelectedCategories([]);
      } else {
        alert(response.message || "Không thể xóa các danh mục đã chọn");
      }
    } catch (error) {
      console.error("Error bulk deleting categories:", error);
      alert("Có lỗi xảy ra khi xóa các danh mục");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2">
              <FolderTree className="w-6 h-6 text-primary" />
              Quản lý danh mục
            </h1>
            <p className="page-subtitle">Quản lý cấu trúc phân loại sản phẩm</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchCategories()}
              className="btn btn-outline"
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Làm mới
            </button>
            <button onClick={handleAddCategory} className="btn btn-primary">
              <Plus className="w-4 h-4" />
              Thêm danh mục
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tìm kiếm
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tên danh mục..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Parent Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục cha
              </label>
              <select
                value={filters.parentId}
                onChange={(e) => handleFilterChange("parentId", e.target.value)}
                className="select"
              >
                <option value="">Tất cả danh mục</option>
                {parentCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
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
                <option value="20">20 kết quả</option>
                <option value="50">50 kết quả</option>
                <option value="100">100 kết quả</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      {selectedCategories.length > 0 && (
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Đã chọn {selectedCategories.length} danh mục
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

      {/* Categories Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Cây danh mục</h3>
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
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <FolderTree className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Không có danh mục
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Không tìm thấy danh mục nào phù hợp với bộ lọc.
              </p>
              <div className="mt-4">
                <button
                  onClick={handleAddCategory}
                  className="btn btn-primary btn-sm"
                >
                  <Plus className="w-4 h-4" />
                  Thêm danh mục đầu tiên
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
                            selectedCategories.length ===
                              flatCategories.length && flatCategories.length > 0
                          }
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên danh mục
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sản phẩm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thứ tự
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
                    {categories.map((category) => (
                      <CategoryTreeItem
                        key={category.id}
                        category={category}
                        level={0}
                        selectedCategories={selectedCategories}
                        onSelect={handleCategorySelection}
                        onEdit={handleEditCategory}
                        onDelete={handleDeleteCategory}
                        collapsed={collapsed}
                        onToggle={handleToggle}
                      />
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

      {/* Category Form Modal */}
      <CategoryFormModal
        category={editingCategory}
        parentCategories={parentCategories}
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSave={handleSaveCategory}
      />
    </div>
  );
};

export default AdminCategories;
