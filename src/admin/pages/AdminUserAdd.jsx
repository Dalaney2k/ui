import React, { useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  MapPin,
  Settings,
  Eye,
  EyeOff,
  Users,
  Briefcase,
  UserPlus,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { userService } from "../services/AdminApiService";
import PasswordStrengthIndicator from "../components/PasswordStrengthIndicator";
import AvatarUpload from "../components/AvatarUpload";

const AdminUserAdd = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get("type") || "customer"; // customer or staff

  // Form state
  const [formData, setFormData] = useState({
    // Basic Info
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: 1, // 1: Male, 2: Female, 0: Other
    avatar: null,
    avatarPreview: null,

    // Role & Status
    role: userType === "staff" ? "Staff" : "Customer",
    isActive: true,
    status: 2, // 1: Pending, 2: Active, 3: Locked
    tier: 1, // Customer tier (Bronze, Silver, Gold)

    // Preferences
    preferredLanguage: "vi",
    preferredCurrency: "VND",
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,

    // Staff specific
    ...(userType === "staff" && {
      department: "",
      position: "",
      salary: "",
      startDate: "",
      permissions: {
        canManageProducts: false,
        canManageOrders: false,
        canManageUsers: false,
        canViewReports: false,
      },
    }),

    // Customer specific
    ...(userType === "customer" && {
      initialPoints: 0,
      initialSpent: 0,
      referralCode: "",
    }),

    // Address (optional)
    addAddress: false,
    address: {
      title: "",
      fullAddress: "",
      provinceId: "",
      districtId: "",
      wardId: "",
      isDefault: true,
    },
  });

  const [validation, setValidation] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    level: "weak",
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
  });

  // Check password strength
  const checkPasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;
    const strength = score / 5;

    return {
      checks,
      score,
      strength,
      level: strength >= 0.8 ? "strong" : strength >= 0.6 ? "medium" : "weak",
    };
  };

  // Validate field
  const validateField = (field, value) => {
    let error = null;

    switch (field) {
      case "firstName":
      case "lastName":
        if (!value || value.trim().length < 2) {
          error = "Họ tên phải có ít nhất 2 ký tự";
        }
        break;
      case "email":
        if (!value) {
          error = "Email là bắt buộc";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Định dạng email không hợp lệ";
        }
        break;
      case "userName":
        if (!value) {
          error = "Tên đăng nhập là bắt buộc";
        } else if (value.length < 3) {
          error = "Tên đăng nhập phải có ít nhất 3 ký tự";
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error = "Tên đăng nhập chỉ chấp nhận chữ cái, số và dấu gạch dưới";
        }
        break;
      case "password":
        if (!value) {
          error = "Mật khẩu là bắt buộc";
        } else if (value.length < 8) {
          error = "Mật khẩu phải có ít nhất 8 ký tự";
        } else {
          const strength = checkPasswordStrength(value);
          setPasswordStrength(strength);
          if (strength.score < 3) {
            error = "Mật khẩu quá yếu";
          }
        }
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          error = "Mật khẩu xác nhận không khớp";
        }
        break;
      case "phoneNumber":
        if (value && !/^[0-9]{10,11}$/.test(value.replace(/\s+/g, ""))) {
          error = "Số điện thoại không hợp lệ";
        }
        break;
    }

    setValidation((prev) => ({ ...prev, [field]: error }));
    return error === null;
  };

  // Update form field
  const updateField = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    validateField(field, value);
  };

  // Handle avatar upload
  const handleAvatarChange = (file, error, preview) => {
    if (error) {
      setValidation((prev) => ({ ...prev, avatar: error }));
    } else {
      setFormData((prev) => ({
        ...prev,
        avatar: file,
        avatarPreview: preview,
      }));
      setValidation((prev) => ({ ...prev, avatar: null }));
    }
  };

  // Remove avatar
  const handleAvatarRemove = () => {
    setFormData((prev) => ({
      ...prev,
      avatar: null,
      avatarPreview: null,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate all required fields
      const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "userName",
        "password",
        "confirmPassword",
      ];

      let isValid = true;
      requiredFields.forEach((field) => {
        if (!validateField(field, formData[field])) {
          isValid = false;
        }
      });

      if (!isValid) {
        throw new Error("Vui lòng kiểm tra lại thông tin");
      }

      // Create user payload
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        userName: formData.userName,
        password: formData.password,
        phoneNumber: formData.phoneNumber || null,
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender,
        role: formData.role,
        isActive: formData.isActive,
        status: formData.status,
        tier: formData.tier,
        preferredLanguage: formData.preferredLanguage,
        preferredCurrency: formData.preferredCurrency,
        emailNotifications: formData.emailNotifications,
        smsNotifications: formData.smsNotifications,
        pushNotifications: formData.pushNotifications,
      };

      // Add staff specific data
      if (userType === "staff") {
        payload.department = formData.department;
        payload.position = formData.position;
        payload.salary = formData.salary ? parseFloat(formData.salary) : 0;
        payload.startDate = formData.startDate;
        payload.permissions = formData.permissions;
      }

      // Add customer specific data
      if (userType === "customer") {
        payload.initialPoints = formData.initialPoints;
        payload.initialSpent = formData.initialSpent;
        payload.referralCode = formData.referralCode;
      }

      // Add address if specified
      if (formData.addAddress && formData.address.fullAddress) {
        payload.initialAddress = formData.address;
      }

      // Create user
      await userService.createUser(payload);

      // Success
      alert(
        `Tạo ${userType === "staff" ? "nhân viên" : "khách hàng"} thành công!`
      );
      navigate("/admin/users");
    } catch (error) {
      console.error("Create user error:", error);
      alert("Lỗi tạo người dùng: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const userTypeConfig = {
    customer: {
      title: "Thêm khách hàng mới",
      icon: User,
      color: "sakura",
      description: "Tạo tài khoản khách hàng mới cho hệ thống",
    },
    staff: {
      title: "Thêm nhân viên mới",
      icon: Briefcase,
      color: "info",
      description: "Tạo tài khoản nhân viên với quyền truy cập admin",
    },
  };

  const config = userTypeConfig[userType];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/admin/users")}
            className="btn btn-ghost btn-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </button>
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg bg-${config.color}-100 text-${config.color}-600`}
            >
              <config.icon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zen-gray-900">
                {config.title}
              </h1>
              <p className="text-zen-gray-500">{config.description}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() =>
              navigate(
                `/admin/users/add?type=${
                  userType === "customer" ? "staff" : "customer"
                }`
              )
            }
          >
            <Users className="h-4 w-4" />
            Chuyển sang {userType === "customer" ? "nhân viên" : "khách hàng"}
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-sakura-primary" />
                <h3 className="card-title">Thông tin cơ bản</h3>
              </div>
            </div>
            <div className="card-content space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label required">Họ</label>
                  <input
                    type="text"
                    className={`form-input ${
                      validation.firstName ? "error" : ""
                    }`}
                    placeholder="Nhập họ"
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    required
                  />
                  {validation.firstName && (
                    <p className="form-error">{validation.firstName}</p>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label required">Tên</label>
                  <input
                    type="text"
                    className={`form-input ${
                      validation.lastName ? "error" : ""
                    }`}
                    placeholder="Nhập tên"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    required
                  />
                  {validation.lastName && (
                    <p className="form-error">{validation.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email & Username */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label required">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zen-gray-400" />
                    <input
                      type="email"
                      className={`form-input pl-10 ${
                        validation.email ? "error" : ""
                      }`}
                      placeholder="user@example.com"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      required
                    />
                  </div>
                  {validation.email && (
                    <p className="form-error">{validation.email}</p>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label required">Tên đăng nhập</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zen-gray-400" />
                    <input
                      type="text"
                      className={`form-input pl-10 ${
                        validation.userName ? "error" : ""
                      }`}
                      placeholder="username"
                      value={formData.userName}
                      onChange={(e) => updateField("userName", e.target.value)}
                      required
                    />
                  </div>
                  {validation.userName && (
                    <p className="form-error">{validation.userName}</p>
                  )}
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label required">Mật khẩu</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zen-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-input pl-10 pr-10 ${
                        validation.password ? "error" : ""
                      }`}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zen-gray-400 hover:text-zen-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <PasswordStrengthIndicator
                    password={formData.password}
                    strength={passwordStrength}
                    onStrengthChange={setPasswordStrength}
                  />
                  {validation.password && (
                    <p className="form-error">{validation.password}</p>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label required">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zen-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className={`form-input pl-10 pr-10 ${
                        validation.confirmPassword ? "error" : ""
                      }`}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        updateField("confirmPassword", e.target.value)
                      }
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zen-gray-400 hover:text-zen-gray-600"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {validation.confirmPassword && (
                    <p className="form-error">{validation.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Phone & Date of Birth */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Số điện thoại</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zen-gray-400" />
                    <input
                      type="tel"
                      className={`form-input pl-10 ${
                        validation.phoneNumber ? "error" : ""
                      }`}
                      placeholder="0901234567"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        updateField("phoneNumber", e.target.value)
                      }
                    />
                  </div>
                  {validation.phoneNumber && (
                    <p className="form-error">{validation.phoneNumber}</p>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Ngày sinh</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zen-gray-400" />
                    <input
                      type="date"
                      className="form-input pl-10"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        updateField("dateOfBirth", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Gender */}
              <div className="form-group">
                <label className="form-label">Giới tính</label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="1"
                      checked={formData.gender === 1}
                      onChange={(e) =>
                        updateField("gender", parseInt(e.target.value))
                      }
                      className="form-radio"
                    />
                    <span>Nam</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="2"
                      checked={formData.gender === 2}
                      onChange={(e) =>
                        updateField("gender", parseInt(e.target.value))
                      }
                      className="form-radio"
                    />
                    <span>Nữ</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="0"
                      checked={formData.gender === 0}
                      onChange={(e) =>
                        updateField("gender", parseInt(e.target.value))
                      }
                      className="form-radio"
                    />
                    <span>Khác</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Staff Specific Fields */}
          {userType === "staff" && (
            <div className="card">
              <div className="card-header">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-info" />
                  <h3 className="card-title">Thông tin công việc</h3>
                </div>
              </div>
              <div className="card-content space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Phòng ban</label>
                    <select
                      className="form-select"
                      value={formData.department}
                      onChange={(e) =>
                        updateField("department", e.target.value)
                      }
                    >
                      <option value="">Chọn phòng ban</option>
                      <option value="sales">Kinh doanh</option>
                      <option value="marketing">Marketing</option>
                      <option value="tech">Kỹ thuật</option>
                      <option value="hr">Nhân sự</option>
                      <option value="finance">Tài chính</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Chức vụ</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Nhập chức vụ"
                      value={formData.position}
                      onChange={(e) => updateField("position", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Lương cơ bản</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="0"
                      value={formData.salary}
                      onChange={(e) => updateField("salary", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ngày bắt đầu</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.startDate}
                      onChange={(e) => updateField("startDate", e.target.value)}
                    />
                  </div>
                </div>

                {/* Permissions */}
                <div className="form-group">
                  <label className="form-label">Quyền hạn</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries({
                      canManageProducts: "Quản lý sản phẩm",
                      canManageOrders: "Quản lý đơn hàng",
                      canManageUsers: "Quản lý người dùng",
                      canViewReports: "Xem báo cáo",
                    }).map(([key, label]) => (
                      <label
                        key={key}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions[key]}
                          onChange={(e) =>
                            updateField(`permissions.${key}`, e.target.checked)
                          }
                          className="form-checkbox"
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Customer Specific Fields */}
          {userType === "customer" && (
            <div className="card">
              <div className="card-header">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-sakura-primary" />
                  <h3 className="card-title">Thông tin khách hàng</h3>
                </div>
              </div>
              <div className="card-content space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-group">
                    <label className="form-label">Hạng thành viên</label>
                    <select
                      className="form-select"
                      value={formData.tier}
                      onChange={(e) =>
                        updateField("tier", parseInt(e.target.value))
                      }
                    >
                      <option value="1">Đồng (Bronze)</option>
                      <option value="2">Bạc (Silver)</option>
                      <option value="3">Vàng (Gold)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Điểm ban đầu</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="0"
                      min="0"
                      value={formData.initialPoints}
                      onChange={(e) =>
                        updateField(
                          "initialPoints",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mã giới thiệu</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="REF123"
                      value={formData.referralCode}
                      onChange={(e) =>
                        updateField("referralCode", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Optional Address */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-zen-gray-600" />
                  <h3 className="card-title">Địa chỉ (tùy chọn)</h3>
                </div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.addAddress}
                    onChange={(e) =>
                      updateField("addAddress", e.target.checked)
                    }
                    className="form-checkbox"
                  />
                  <span className="text-sm">Thêm địa chỉ ban đầu</span>
                </label>
              </div>
            </div>
            {formData.addAddress && (
              <div className="card-content space-y-4">
                <div className="form-group">
                  <label className="form-label">Tiêu đề địa chỉ</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nhà riêng, Công ty..."
                    value={formData.address.title}
                    onChange={(e) =>
                      updateField("address.title", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Địa chỉ đầy đủ</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="Nhập địa chỉ đầy đủ..."
                    value={formData.address.fullAddress}
                    onChange={(e) =>
                      updateField("address.fullAddress", e.target.value)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Avatar Upload */}
          <div className="card">
            <div className="card-content">
              <AvatarUpload
                avatarPreview={formData.avatarPreview}
                onAvatarChange={handleAvatarChange}
                onAvatarRemove={handleAvatarRemove}
                error={validation.avatar}
              />
            </div>
          </div>

          {/* Status & Settings */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-zen-gray-600" />
                <h3 className="card-title">Cài đặt tài khoản</h3>
              </div>
            </div>
            <div className="card-content space-y-4">
              {/* Account Status */}
              <div className="form-group">
                <label className="form-label">Trạng thái tài khoản</label>
                <div className="space-y-2">
                  {[
                    { value: 1, label: "Chờ xác thực", color: "warning" },
                    { value: 2, label: "Hoạt động", color: "success" },
                    { value: 3, label: "Tạm khóa", color: "error" },
                  ].map((status) => (
                    <label
                      key={status.value}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="status"
                        value={status.value}
                        checked={formData.status === status.value}
                        onChange={(e) =>
                          updateField("status", parseInt(e.target.value))
                        }
                        className="form-radio"
                      />
                      <span
                        className={`flex items-center space-x-2 text-${status.color}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full bg-${status.color}`}
                        />
                        <span>{status.label}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div className="form-group">
                <label className="form-label">Tùy chọn</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        updateField("isActive", e.target.checked)
                      }
                      className="form-checkbox"
                    />
                    <span>Tài khoản hoạt động</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.emailNotifications}
                      onChange={(e) =>
                        updateField("emailNotifications", e.target.checked)
                      }
                      className="form-checkbox"
                    />
                    <span>Thông báo email</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.smsNotifications}
                      onChange={(e) =>
                        updateField("smsNotifications", e.target.checked)
                      }
                      className="form-checkbox"
                    />
                    <span>Thông báo SMS</span>
                  </label>
                </div>
              </div>

              {/* Language & Currency */}
              <div className="space-y-3">
                <div className="form-group">
                  <label className="form-label">Ngôn ngữ</label>
                  <select
                    className="form-select"
                    value={formData.preferredLanguage}
                    onChange={(e) =>
                      updateField("preferredLanguage", e.target.value)
                    }
                  >
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Tiền tệ</label>
                  <select
                    className="form-select"
                    value={formData.preferredCurrency}
                    onChange={(e) =>
                      updateField("preferredCurrency", e.target.value)
                    }
                  >
                    <option value="VND">VND (₫)</option>
                    <option value="USD">USD ($)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="card">
            <div className="card-content">
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className={`btn btn-${config.color} w-full`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Tạo {userType === "staff" ? "nhân viên" : "khách hàng"}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost w-full"
                  onClick={() => navigate("/admin/users")}
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminUserAdd;
