import React, { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";

const AddressForm = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  initialData = {},
  user,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    ward: "",
    district: "",
    city: "",
    postalCode: "",
    country: "Vietnam",
    isDefault: false,
  });

  const [errors, setErrors] = useState({});

  // Initialize form data
  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: initialData.fullName || user?.name || "",
        phoneNumber: initialData.phoneNumber || user?.phone || "",
        addressLine1: initialData.addressLine1 || "",
        addressLine2: initialData.addressLine2 || "",
        ward: initialData.ward || "",
        district: initialData.district || "",
        city: initialData.city || "",
        postalCode: initialData.postalCode || "",
        country: initialData.country || "Vietnam",
        isDefault: initialData.isDefault || false,
      });
      setErrors({});
    }
  }, [isOpen, initialData, user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    const requiredFields = {
      fullName: "Vui lòng nhập họ và tên",
      phoneNumber: "Vui lòng nhập số điện thoại",
      addressLine1: "Vui lòng nhập địa chỉ chi tiết",
      ward: "Vui lòng nhập phường/xã",
      district: "Vui lòng nhập quận/huyện",
      city: "Vui lòng nhập tỉnh/thành phố",
    };

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = message;
      }
    });

    // Phone number validation
    if (
      formData.phoneNumber &&
      !/^[0-9+\-\s()]{10,15}$/.test(formData.phoneNumber.replace(/\s/g, ""))
    ) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    }

    // Name validation
    if (formData.fullName && formData.fullName.trim().length < 2) {
      newErrors.fullName = "Họ tên phải có ít nhất 2 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await onSubmit(formData);
      if (result?.success) {
        onClose();
      } else if (result?.error) {
        setErrors({ general: result.error });
      }
    } catch (error) {
      console.error("Address form submit error:", error);
      setErrors({ general: "Không thể lưu địa chỉ. Vui lòng thử lại." });
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {initialData.id ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
            </h3>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{errors.general}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.fullName
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Nhập họ và tên"
                  disabled={loading}
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.phoneNumber
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="0901234567"
                  disabled={loading}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Address Lines */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ chi tiết *
              </label>
              <input
                type="text"
                value={formData.addressLine1}
                onChange={(e) => handleChange("addressLine1", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.addressLine1
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Số nhà, tên đường"
                disabled={loading}
              />
              {errors.addressLine1 && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.addressLine1}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ bổ sung (tùy chọn)
              </label>
              <input
                type="text"
                value={formData.addressLine2}
                onChange={(e) => handleChange("addressLine2", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Tòa nhà, tầng, căn hộ..."
                disabled={loading}
              />
            </div>

            {/* Location Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phường/Xã *
                </label>
                <input
                  type="text"
                  value={formData.ward}
                  onChange={(e) => handleChange("ward", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.ward ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="Phường 1"
                  disabled={loading}
                />
                {errors.ward && (
                  <p className="mt-1 text-xs text-red-600">{errors.ward}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quận/Huyện *
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => handleChange("district", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.district
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Quận 1"
                  disabled={loading}
                />
                {errors.district && (
                  <p className="mt-1 text-xs text-red-600">{errors.district}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tỉnh/Thành phố *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.city ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="TP.HCM"
                  disabled={loading}
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-600">{errors.city}</p>
                )}
              </div>
            </div>

            {/* Postal Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã bưu điện (tùy chọn)
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => handleChange("postalCode", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="70000"
                disabled={loading}
              />
            </div>

            {/* Default Address Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="defaultAddress"
                checked={formData.isDefault}
                onChange={(e) => handleChange("isDefault", e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                disabled={loading}
              />
              <label
                htmlFor="defaultAddress"
                className="ml-2 text-sm text-gray-700"
              >
                Đặt làm địa chỉ mặc định
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center font-medium"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Đang lưu...
                  </>
                ) : initialData.id ? (
                  "Cập nhật địa chỉ"
                ) : (
                  "Thêm địa chỉ"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
