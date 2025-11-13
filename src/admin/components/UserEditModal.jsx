import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Star,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { userService } from "../services/adminApi";

const UserEditModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    role: "Customer",
    tier: "Bronze",
    status: "Active",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // Initialize form data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
        role: user.role || "Customer",
        tier:
          typeof user.tier === "number"
            ? user.tier === 5
              ? "Diamond"
              : user.tier === 4
              ? "Platinum"
              : user.tier === 3
              ? "Gold"
              : user.tier === 2
              ? "Silver"
              : "Bronze"
            : user.tier || "Bronze",
        status:
          typeof user.status === "number"
            ? user.status === 2
              ? "Active"
              : user.status === 3
              ? "Suspended"
              : user.status === 4
              ? "Banned"
              : user.status === 5
              ? "Inactive"
              : "Pending"
            : user.status || "Active",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Tên không được để trống";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Họ không được để trống";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (formData.phoneNumber && !/^[0-9+\-\s()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    }

    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const updateData = {
        ...formData,
        id: user.id,
      };

      // Remove empty password fields
      if (!updateData.password) {
        delete updateData.password;
        delete updateData.confirmPassword;
      }

      await userService.updateUser(user.id, updateData);

      onSave(updateData);
    } catch (error) {
      console.error("Update user error:", error);
      setErrors({ submit: "Có lỗi xảy ra khi cập nhật người dùng" });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "basic", name: "Thông tin cơ bản", icon: User },
    { id: "security", name: "Bảo mật", icon: Shield },
    { id: "settings", name: "Cài đặt", icon: Star },
  ];

  const roleOptions = [
    { value: "Customer", label: "Khách hàng", color: "bg-gray-400" },
    { value: "Staff", label: "Nhân viên", color: "bg-yellow-500" },
    { value: "Admin", label: "Quản trị viên", color: "bg-red-500" },
    { value: "SuperAdmin", label: "Quản trị cấp cao", color: "bg-purple-600" },
  ];

  const tierOptions = [
    {
      value: "Bronze",
      label: "Bronze",
      color: "bg-gradient-to-r from-amber-600 to-orange-600",
    },
    {
      value: "Silver",
      label: "Silver",
      color: "bg-gradient-to-r from-slate-300 to-slate-400",
    },
    {
      value: "Gold",
      label: "Gold",
      color: "bg-gradient-to-r from-yellow-400 to-amber-500",
    },
    {
      value: "Platinum",
      label: "Platinum",
      color: "bg-gradient-to-r from-slate-400 to-slate-500",
    },
    {
      value: "Diamond",
      label: "Diamond",
      color: "bg-gradient-to-r from-cyan-400 to-blue-500",
    },
  ];

  const statusOptions = [
    { value: "Active", label: "Hoạt động", color: "bg-green-500" },
    { value: "Inactive", label: "Không hoạt động", color: "bg-gray-400" },
    { value: "Suspended", label: "Tạm khóa", color: "bg-yellow-500" },
    { value: "Banned", label: "Cấm vĩnh viễn", color: "bg-red-500" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Chỉnh sửa người dùng</h2>
                <p className="text-blue-100 text-sm">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex">
            {/* Sidebar Tabs */}
            <div className="w-1/4 bg-gray-50 border-r">
              <div className="p-4 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
              {/* Basic Information Tab */}
              {activeTab === "basic" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <User size={20} className="text-blue-600" />
                    <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label required">Tên</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className={`form-input ${
                          errors.firstName ? "border-red-500" : ""
                        }`}
                        placeholder="Nhập tên"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label required">Họ</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className={`form-input ${
                          errors.lastName ? "border-red-500" : ""
                        }`}
                        placeholder="Nhập họ"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label required">
                      <Mail size={16} className="inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`form-input ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      placeholder="user@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Phone size={16} className="inline mr-2" />
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      className={`form-input ${
                        errors.phoneNumber ? "border-red-500" : ""
                      }`}
                      placeholder="+84 123 456 789"
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <MapPin size={16} className="inline mr-2" />
                      Địa chỉ
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      className="form-input"
                      rows={3}
                      placeholder="Nhập địa chỉ"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Calendar size={16} className="inline mr-2" />
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange("dateOfBirth", e.target.value)
                      }
                      className="form-input"
                    />
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield size={20} className="text-green-600" />
                    <h3 className="text-lg font-semibold">Bảo mật</h3>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="text-yellow-600" />
                      <p className="text-yellow-800 text-sm">
                        Chỉ nhập mật khẩu nếu bạn muốn thay đổi. Để trống nếu
                        giữ nguyên.
                      </p>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mật khẩu mới</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        className={`form-input pr-10 ${
                          errors.password ? "border-red-500" : ""
                        }`}
                        placeholder="Nhập mật khẩu mới (tùy chọn)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Xác nhận mật khẩu</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        className={`form-input pr-10 ${
                          errors.confirmPassword ? "border-red-500" : ""
                        }`}
                        placeholder="Nhập lại mật khẩu"
                        disabled={!formData.password}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={!formData.password}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star size={20} className="text-purple-600" />
                    <h3 className="text-lg font-semibold">Cài đặt tài khoản</h3>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Vai trò</label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        handleInputChange("role", e.target.value)
                      }
                      className="form-input"
                    >
                      {roleOptions.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2 mt-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          roleOptions.find((r) => r.value === formData.role)
                            ?.color
                        }`}
                      ></div>
                      <span className="text-sm text-gray-600">
                        {
                          roleOptions.find((r) => r.value === formData.role)
                            ?.label
                        }
                      </span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Hạng thành viên</label>
                    <select
                      value={formData.tier}
                      onChange={(e) =>
                        handleInputChange("tier", e.target.value)
                      }
                      className="form-input"
                    >
                      {tierOptions.map((tier) => (
                        <option key={tier.value} value={tier.value}>
                          {tier.label}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2 mt-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          tierOptions.find((t) => t.value === formData.tier)
                            ?.color
                        }`}
                      ></div>
                      <span className="text-sm text-gray-600">
                        {
                          tierOptions.find((t) => t.value === formData.tier)
                            ?.label
                        }
                      </span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Trạng thái</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                      className="form-input"
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2 mt-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          statusOptions.find((s) => s.value === formData.status)
                            ?.color
                        }`}
                      ></div>
                      <span className="text-sm text-gray-600">
                        {
                          statusOptions.find((s) => s.value === formData.status)
                            ?.label
                        }
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-blue-600" />
                      <p className="text-blue-800 text-sm">
                        Thay đổi này sẽ được áp dụng ngay lập tức và người dùng
                        sẽ nhận được thông báo.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{errors.submit}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}
            </div>
            <div className="flex items-center gap-3">
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
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;
