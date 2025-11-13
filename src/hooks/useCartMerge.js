// hooks/useCartMerge.js - Hook to handle cart merging after login
import { useContext } from "react";
import CartContext from "../contexts/CartContext";

export const useCartMerge = () => {
  const cartContext = useContext(CartContext);

  const mergeCartsAfterLogin = async () => {
    try {
      const guestSessionId = localStorage.getItem("guestSessionId");
      if (!guestSessionId) {
        console.log("🔀 No guest session to merge");
        return { success: true, message: "No guest cart to merge" };
      }

      console.log("🔀 Merging guest cart after login...");

      if (cartContext?.mergeGuestCart) {
        const result = await cartContext.mergeGuestCart();

        if (result.success) {
          console.log("✅ Guest cart merged successfully");
          // Reload cart to get merged data
          if (cartContext.loadCart) {
            await cartContext.loadCart();
          }
        }

        return result;
      }

      return { success: false, message: "Cart context not available" };
    } catch (error) {
      console.error("🔀 Error merging guest cart:", error);
      return { success: false, message: error.message };
    }
  };

  return {
    mergeCartsAfterLogin,
  };
};
