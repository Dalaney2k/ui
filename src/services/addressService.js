// src/services/addressService.js
import apiClient from "./api";

export const addressService = {
  // Lấy danh sách địa chỉ của user
  getAddresses: async () => {
    try {
      const response = await apiClient.get("/user/addresses");
      return response;
    } catch (error) {
      console.error("Get addresses error:", error);
      throw error;
    }
  },

  // Thêm địa chỉ mới
  addAddress: async (addressData) => {
    try {
      const response = await apiClient.post("/user/addresses", addressData);
      return response;
    } catch (error) {
      console.error("Add address error:", error);
      throw error;
    }
  },

  // Cập nhật địa chỉ
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await apiClient.put(
        `/user/addresses/${addressId}`,
        addressData
      );
      return response;
    } catch (error) {
      console.error("Update address error:", error);
      throw error;
    }
  },

  // Xóa địa chỉ
  deleteAddress: async (addressId) => {
    try {
      const response = await apiClient.delete(`/user/addresses/${addressId}`);
      return response;
    } catch (error) {
      console.error("Delete address error:", error);
      throw error;
    }
  },

  // Đặt địa chỉ mặc định
  setDefaultAddress: async (addressId) => {
    try {
      const response = await apiClient.patch(
        `/user/addresses/${addressId}/default`
      );
      return response;
    } catch (error) {
      console.error("Set default address error:", error);
      throw error;
    }
  },
};
