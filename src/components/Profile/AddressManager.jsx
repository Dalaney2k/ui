import React, { useState, useEffect } from "react";
import {
  MapPin,
  Plus,
  Edit3,
  Trash2,
  Home,
  Building2,
  Check,
  X,
} from "lucide-react";
import { addressService } from "../../services";

const AddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    name: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Việt Nam",
    isDefault: false,
    type: "home", // home, work, other
  });
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const addNotification = (type, message) => {
    const notification = {
      id: Date.now(),
      type,
      message,
    };
    setNotifications((prev) => [...prev, notification]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 5000);
  };

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await addressService.getAddresses();

      if (response.success) {
        setAddresses(response.addresses || []);
      } else {
        setError(response.message || "Không thể tải địa chỉ");
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setError("Không thể tải địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (editingAddress) {
        // Update existing address
        const response = await addressService.updateAddress(
          editingAddress.id,
          addressForm
        );
        if (response.success) {
          addNotification("success", "Cập nhật địa chỉ thành công");
          await fetchAddresses(); // Refresh list
        } else {
          addNotification(
            "error",
            response.message || "Không thể cập nhật địa chỉ"
          );
        }
      } else {
        // Add new address
        const response = await addressService.addAddress(addressForm);
        if (response.success) {
          addNotification("success", "Thêm địa chỉ thành công");
          await fetchAddresses(); // Refresh list
        } else {
          addNotification(
            "error",
            response.message || "Không thể thêm địa chỉ"
          );
        }
      }

      resetForm();
    } catch (error) {
      console.error("Error saving address:", error);
      addNotification("error", "Có lỗi xảy ra khi lưu địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await addressService.deleteAddress(addressId);

      if (response.success) {
        addNotification("success", "Xóa địa chỉ thành công");
        await fetchAddresses(); // Refresh list
      } else {
        addNotification("error", response.message || "Không thể xóa địa chỉ");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      addNotification("error", "Có lỗi xảy ra khi xóa địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      setLoading(true);
      const response = await addressService.setDefaultAddress(addressId);

      if (response.success) {
        addNotification("success", "Đặt địa chỉ mặc định thành công");
        await fetchAddresses(); // Refresh list
      } else {
        addNotification(
          "error",
          response.message || "Không thể đặt địa chỉ mặc định"
        );
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      addNotification("error", "Có lỗi xảy ra khi đặt địa chỉ mặc định");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAddressForm({
      name: "",
      phoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Việt Nam",
      isDefault: false,
      type: "home",
    });
    setEditingAddress(null);
    setShowAddForm(false);
  };

  const handleEditAddress = (address) => {
    setAddressForm(address);
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const getAddressTypeIcon = (type) => {
    switch (type) {
      case "home":
        return <Home className="w-4 h-4" />;
      case "work":
        return <Building2 className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getAddressTypeLabel = (type) => {
    switch (type) {
      case "home":
        return "Nhà riêng";
      case "work":
        return "Văn phòng";
      default:
        return "Khác";
    }
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg max-w-md ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            <div className="text-sm">{notification.message}</div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Quản lý địa chỉ</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm địa chỉ mới</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
          <span className="ml-2 text-gray-600">Đang tải...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-700">{error}</div>
          <button
            onClick={fetchAddresses}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Address List */}
      {!loading && !error && (
        <div className="grid gap-4">
          {addresses.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Chưa có địa chỉ nào
              </h3>
              <p className="text-gray-500 mb-4">
                Thêm địa chỉ để dễ dàng đặt hàng
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Thêm địa chỉ đầu tiên
              </button>
            </div>
          ) : (
            addresses.map((address) => (
              <div
                key={address.id}
                className={`p-4 border rounded-lg bg-white hover:shadow-md transition-shadow ${
                  address.isDefault
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getAddressTypeIcon(address.type)}
                      <span className="font-medium text-gray-900">
                        {getAddressTypeLabel(address.type)}
                      </span>
                      {address.isDefault && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                          Mặc định
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-gray-600">
                      <div className="font-medium text-gray-900">
                        {address.name} | {address.phoneNumber}
                      </div>
                      <div>{address.addressLine1}</div>
                      {address.addressLine2 && (
                        <div>{address.addressLine2}</div>
                      )}
                      <div>
                        {address.city}, {address.state} {address.postalCode}
                      </div>
                      <div>{address.country}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefaultAddress(address.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Đặt làm mặc định"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add/Edit Address Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleSubmitAddress} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressForm.name}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white placeholder-gray-500"
                    placeholder="Nhập họ và tên"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={addressForm.phoneNumber}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white placeholder-gray-500"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>

                {/* Address Line 1 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressForm.addressLine1}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        addressLine1: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white placeholder-gray-500"
                    placeholder="Số nhà, tên đường"
                    required
                  />
                </div>

                {/* Address Line 2 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ chi tiết
                  </label>
                  <input
                    type="text"
                    value={addressForm.addressLine2}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        addressLine2: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white placeholder-gray-500"
                    placeholder="Phường/Xã, Quận/Huyện"
                  />
                </div>

                {/* City and State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thành phố <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, city: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white placeholder-gray-500"
                      placeholder="Thành phố"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tỉnh/Thành phố <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          state: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white placeholder-gray-500"
                      placeholder="Tỉnh/Thành phố"
                      required
                    />
                  </div>
                </div>

                {/* Postal Code and Country */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã bưu điện
                    </label>
                    <input
                      type="text"
                      value={addressForm.postalCode}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          postalCode: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white placeholder-gray-500"
                      placeholder="Mã bưu điện"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quốc gia
                    </label>
                    <select
                      value={addressForm.country}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          country: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white"
                    >
                      <option value="Việt Nam">Việt Nam</option>
                      <option value="USA">USA</option>
                      <option value="Japan">Japan</option>
                    </select>
                  </div>
                </div>

                {/* Address Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại địa chỉ
                  </label>
                  <select
                    value={addressForm.type}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, type: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white"
                  >
                    <option value="home">Nhà riêng</option>
                    <option value="work">Văn phòng</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                {/* Set as Default */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={addressForm.isDefault}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        isDefault: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label
                    htmlFor="isDefault"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {loading
                      ? "Đang lưu..."
                      : editingAddress
                      ? "Cập nhật"
                      : "Thêm địa chỉ"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressManager;
