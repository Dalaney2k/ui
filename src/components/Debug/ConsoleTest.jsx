import React from "react";
import { wishlistService } from "../../services";

const ConsoleTest = () => {
  console.log("🔍 Console Test Component loaded");
  console.log("📦 Testing imports...");
  console.log(
    "✅ wishlistService imported successfully:",
    typeof wishlistService
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
        zIndex: 9999,
      }}
    >
      Console Test Active - Check DevTools
    </div>
  );
};

export default ConsoleTest;
