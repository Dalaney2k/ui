import React, { useState } from "react";
import { X, MapPin, Plus, Edit } from "lucide-react";

const AddressSelectionModal = ({
  isOpen,
  onClose,
  addresses = [],
  selectedAddress,
  onSelectAddress,
  onAddNewAddress,
}) => {
  const [selectedId, setSelectedId] = useState(selectedAddress?.id || null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const selected = addresses.find((addr) => addr.id === selectedId);
    if (selected) {
      onSelectAddress(selected);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Chọn địa chỉ giao hàng
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Add New Address Button */}
          <button
            onClick={() => {
              onClose();
              onAddNewAddress();
            }}
            className="w-full mb-4 p-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Thêm địa chỉ mới</span>
          </button>

          {/* Address List */}
          <div className="space-y-3 mb-6">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedId === address.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedId(address.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 mt-1 ${
                        selectedId === address.id
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedId === address.id && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-800">
                          {address.fullName}
                        </span>
                        {address.isDefault && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{address.phoneNumber}</span>
                        </div>
                        <div className="pl-6">
                          <div>{address.addressLine1}</div>
                          {address.addressLine2 && (
                            <div>{address.addressLine2}</div>
                          )}
                          <div className="text-gray-500">
                            {address.ward}, {address.district}, {address.city}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle edit address
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {addresses.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <div className="text-gray-500 mb-4">
                Chưa có địa chỉ giao hàng
              </div>
              <button
                onClick={() => {
                  onClose();
                  onAddNewAddress();
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Thêm địa chỉ đầu tiên
              </button>
            </div>
          )}

          {/* Action Buttons */}
          {addresses.length > 0 && (
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedId}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
              >
                Xác nhận
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressSelectionModal;
