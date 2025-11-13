import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import UserDetailModal from "../components/UserDetailModal";
import UserEditModal from "../components/UserEditModal"; // Import UserEditModal
import {
  Search,
  Plus,
  Filter,
  Trash2,
  Eye,
  Edit,
  Users,
  ChevronDown,
  UserPlus,
  Briefcase,
} from "lucide-react";
import { userService, formatDate } from "../services/AdminApiService";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null); // State để quản lý user đang edit
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddUserDropdown, setShowAddUserDropdown] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    status: "",
    tier: "",
  });

  // Load users data
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await userService.getUsers({
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...filters,
      });

      console.log("👥 [ADMIN-USERS] API Response:", response);

      // Handle both API and mock data responses
      const users = response.users || response.data?.users || [];
      const totalCount = response.totalCount || response.data?.totalCount || 0;

      // 🔍 DEBUG: Log chi tiết user data để kiểm tra field names
      if (users.length > 0) {
        console.log("👤 [ADMIN-USERS] First user sample:", users[0]);
        console.log(
          "💰 [ADMIN-USERS] All available fields:",
          Object.keys(users[0])
        );

        // Log tất cả biến thể có thể của spending fields
        const spendingFields = {};
        Object.keys(users[0]).forEach((key) => {
          if (
            key.toLowerCase().includes("spent") ||
            key.toLowerCase().includes("order") ||
            key.toLowerCase().includes("point")
          ) {
            spendingFields[key] = users[0][key];
          }
        });
        console.log(
          "💸 [ADMIN-USERS] Spending-related fields:",
          spendingFields
        );
      }

      setUsers(users);
      setPagination((prev) => ({
        ...prev,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / pagination.pageSize),
      }));
    } catch (error) {
      console.error("Load users error:", error);
      setError("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, filters]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === "Active" ? "Locked" : "Active";
      await userService.toggleUserStatus(userId, newStatus);
      loadUsers(); // Reload data
    } catch (error) {
      console.error("Toggle status error:", error);
    }
  };

  // Handle edit user - Lấy đầy đủ thông tin từ API
  const handleEditUser = async (user) => {
    try {
      // Show user data immediately without loading
      setEditingUser(user);

      // Fetch full data in background
      const response = await userService.getUserById(user.id);

      if (response.success && response.data) {
        setEditingUser(response.data);
      }
    } catch (error) {
      console.error("Error loading user details:", error);
      // Keep current user data if API fails
    }
  };

  // Handle view user details - Lấy đầy đủ thông tin từ API
  const handleViewUser = async (user) => {
    try {
      // Show user data immediately without loading
      setSelectedUser(user);

      // Fetch full data in background
      const response = await userService.getUserById(user.id);

      if (response.success && response.data) {
        setSelectedUser(response.data);
      }
    } catch (error) {
      console.error("Error loading user details:", error);
      // Keep current user data if API fails
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa người dùng "${userName}"?`)) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      // Remove user from list immediately for better UX
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
      setPagination((prev) => ({
        ...prev,
        totalItems: prev.totalItems - 1,
      }));
    } catch (error) {
      console.error("Delete user error:", error);
      alert("Không thể xóa người dùng. Vui lòng thử lại!");
      // Reload if delete fails
      loadUsers();
    }
  };

  // Handle save user after edit
  const handleSaveUser = (updatedUser) => {
    // Cập nhật user trong danh sách
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      )
    );

    // Đóng modal edit
    setEditingUser(null);

    // Reload lại data để đảm bảo tính nhất quán
    loadUsers();
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Quản lý người dùng</h1>
            <p className="page-subtitle">
              Danh sách và quản lý tài khoản người dùng trong hệ thống
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="btn btn-outline">
              <Filter size={16} />
              Bộ lọc
            </button>

            {/* Add User Dropdown */}
            <div className="relative">
              <button
                className="btn btn-primary"
                onClick={() => setShowAddUserDropdown(!showAddUserDropdown)}
              >
                <Plus size={16} />
                Thêm người dùng
                <ChevronDown size={14} />
              </button>

              {showAddUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-zen-gray-200 z-50">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate("/admin/users/add?type=customer");
                        setShowAddUserDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-left text-sm text-zen-gray-700 hover:bg-zen-gray-50 transition-colors"
                    >
                      <UserPlus className="h-4 w-4 mr-3 text-sakura-primary" />
                      <div>
                        <div className="font-medium">Thêm khách hàng</div>
                        <div className="text-xs text-zen-gray-500">
                          Tạo tài khoản khách hàng mới
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        navigate("/admin/users/add?type=staff");
                        setShowAddUserDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-left text-sm text-zen-gray-700 hover:bg-zen-gray-50 transition-colors"
                    >
                      <Briefcase className="h-4 w-4 mr-3 text-info" />
                      <div>
                        <div className="font-medium">Thêm nhân viên</div>
                        <div className="text-xs text-zen-gray-500">
                          Tạo tài khoản nhân viên với quyền admin
                        </div>
                      </div>
                    </button>
                    <div className="border-t border-zen-gray-200 my-2"></div>
                    <button
                      onClick={() => {
                        navigate("/admin/users/select-type");
                        setShowAddUserDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-left text-sm text-zen-gray-700 hover:bg-zen-gray-50 transition-colors"
                    >
                      <Users className="h-4 w-4 mr-3 text-zen-gray-600" />
                      <div>
                        <div className="font-medium">Chọn loại người dùng</div>
                        <div className="text-xs text-zen-gray-500">
                          Hướng dẫn chi tiết từng loại
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="form-group">
              <label className="form-label">Tìm kiếm</label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="form-input pl-10"
                  placeholder="Email hoặc tên..."
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Vai trò</label>
              <select
                value={filters.role}
                onChange={(e) =>
                  setFilters({ ...filters, role: e.target.value })
                }
                className="form-input"
              >
                <option value="">Tất cả</option>
                <option value="Customer">Khách hàng</option>
                <option value="Staff">Nhân viên</option>
                <option value="Admin">Quản trị viên</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="form-input"
              >
                <option value="">Tất cả</option>
                <option value="Active">Hoạt động</option>
                <option value="Inactive">Không hoạt động</option>
                <option value="Locked">Bị khóa</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Hạng thành viên</label>
              <select
                value={filters.tier}
                onChange={(e) =>
                  setFilters({ ...filters, tier: e.target.value })
                }
                className="form-input"
              >
                <option value="">Tất cả</option>
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Danh sách người dùng</h3>
          <div className="text-sm text-gray-500">
            {pagination.totalItems} người dùng
          </div>
        </div>

        <div className="card-content p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-500 text-lg mb-2">
                ❌ Lỗi tải dữ liệu
              </div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button onClick={loadUsers} className="btn btn-primary">
                Thử lại
              </button>
            </div>
          ) : users.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Người dùng</th>
                    <th>Vai trò</th>
                    <th>Hạng thành viên</th>
                    <th>Trạng thái</th>
                    <th>Tổng chi tiêu</th>
                    <th>Ngày tham gia</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {(
                              user.fullName?.charAt(0) ||
                              user.firstName?.charAt(0) ||
                              user.userName?.charAt(0) ||
                              user.email?.charAt(0) ||
                              "U"
                            ).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">
                              {user.fullName ||
                                `${user.firstName || ""} ${
                                  user.lastName || ""
                                }`.trim() ||
                                user.userName ||
                                user.email ||
                                "Unknown User"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold text-white shadow-sm
                            ${
                              user.role === "SuperAdmin"
                                ? "bg-purple-600"
                                : user.role === "Admin"
                                ? "bg-red-500"
                                : user.role === "Staff"
                                ? "bg-yellow-500 text-gray-900"
                                : "bg-gray-400"
                            }
                          `}
                        >
                          {user.role || "Customer"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold shadow-sm
                            ${
                              user.tier === "Diamond" || user.tier === 5
                                ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white"
                                : user.tier === "Platinum" || user.tier === 4
                                ? "bg-gradient-to-r from-slate-400 to-slate-500 text-white"
                                : user.tier === "Gold" || user.tier === 3
                                ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900"
                                : user.tier === "Silver" || user.tier === 2
                                ? "bg-gradient-to-r from-slate-300 to-slate-400 text-gray-900"
                                : "bg-gradient-to-r from-amber-600 to-orange-600 text-white"
                            }
                          `}
                        >
                          {user.tier === 5
                            ? "Diamond"
                            : user.tier === 4
                            ? "Platinum"
                            : user.tier === 3
                            ? "Gold"
                            : user.tier === 2
                            ? "Silver"
                            : user.tier === 1
                            ? "Bronze"
                            : user.tier || "Bronze"}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            handleStatusToggle(user.id, user.status)
                          }
                          className={`badge cursor-pointer ${
                            user.status === 2 || user.status === "Active"
                              ? "badge-success"
                              : user.status === 3 || user.status === "Suspended"
                              ? "badge-error"
                              : user.status === 4 || user.status === "Banned"
                              ? "badge-error"
                              : user.status === 5 || user.status === "Inactive"
                              ? "badge-gray"
                              : user.status === 1 || user.status === "Pending"
                              ? "badge-warning"
                              : "badge-gray"
                          }`}
                        >
                          {(() => {
                            const statusMap = {
                              1: "Pending",
                              2: "Active",
                              3: "Suspended",
                              4: "Banned",
                              5: "Inactive",
                            };
                            return (
                              statusMap[user.status] || user.status || "Unknown"
                            );
                          })()}
                        </button>
                      </td>
                      <td className="font-medium">
                        {(() => {
                          // Backend có thể dùng nhiều tên field khác nhau
                          const spent =
                            user.totalSpent || // camelCase
                            user.TotalSpent || // PascalCase
                            user.total_spent || // snake_case
                            user.totalSpending ||
                            user.TotalSpending ||
                            0;

                          return (
                            <span
                              className={
                                spent > 0
                                  ? "text-green-600 font-semibold"
                                  : "text-gray-500"
                              }
                            >
                              {Number(spent).toLocaleString("vi-VN")} ₫
                            </span>
                          );
                        })()}
                      </td>
                      <td className="text-sm text-gray-600">
                        {formatDate(user.createdAt || new Date())}
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button
                            className="action-button"
                            title="Xem chi tiết"
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="action-button"
                            title="Chỉnh sửa"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="action-button hover:bg-red-50 hover:text-red-600"
                            title="Xóa người dùng"
                            onClick={() =>
                              handleDeleteUser(
                                user.id,
                                user.fullName || user.userName || user.email
                              )
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Users size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Không tìm thấy người dùng nào</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="card-footer">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Hiển thị {(pagination.page - 1) * pagination.pageSize + 1} -{" "}
                {Math.min(
                  pagination.page * pagination.pageSize,
                  pagination.totalItems
                )}{" "}
                của {pagination.totalItems} kết quả
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                  disabled={pagination.page <= 1}
                  className="btn btn-outline btn-sm"
                >
                  Trước
                </button>
                <span className="px-3 py-1 text-sm">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                  disabled={pagination.page >= pagination.totalPages}
                  className="btn btn-outline btn-sm"
                >
                  Tiếp
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {/* User Edit Modal */}
      {editingUser && (
        <UserEditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default AdminUsers;
