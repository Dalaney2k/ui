import React from "react";
import { useCart } from "../../hooks";

const CartDebugInfo = () => {
  const { cartItems, loading, error, cartItemCount, cartTotal } = useCart();

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg max-w-sm z-50">
      <h3 className="font-bold mb-2">Cart Debug Info</h3>
      <div className="text-xs space-y-1">
        <div>Loading: {loading ? "Yes" : "No"}</div>
        <div>Error: {error || "None"}</div>
        <div>Items count: {cartItemCount}</div>
        <div>Total: {cartTotal}</div>
        <div>Items array length: {cartItems.length}</div>
        <div>Items preview:</div>
        <pre className="bg-gray-800 p-2 rounded text-xs max-h-32 overflow-y-auto">
          {JSON.stringify(cartItems, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default CartDebugInfo;
