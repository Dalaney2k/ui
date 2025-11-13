import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

const PasswordStrengthIndicator = ({
  password,
  strength,
  onStrengthChange,
}) => {
  const checkPasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;
    const strengthLevel = score / 5;

    const result = {
      checks,
      score,
      strength: strengthLevel,
      level:
        strengthLevel >= 0.8
          ? "strong"
          : strengthLevel >= 0.6
          ? "medium"
          : "weak",
    };

    if (onStrengthChange) {
      onStrengthChange(result);
    }

    return result;
  };

  const currentStrength = password ? checkPasswordStrength(password) : strength;

  if (!password || password.length === 0) {
    return null;
  }

  const getStrengthColor = (level) => {
    switch (level) {
      case "strong":
        return "bg-success";
      case "medium":
        return "bg-warning";
      default:
        return "bg-error";
    }
  };

  const getStrengthText = (level) => {
    switch (level) {
      case "strong":
        return "Mật khẩu mạnh";
      case "medium":
        return "Mật khẩu trung bình";
      default:
        return "Mật khẩu yếu";
    }
  };

  const requirements = [
    { key: "length", label: "Ít nhất 8 ký tự" },
    { key: "uppercase", label: "Chữ hoa (A-Z)" },
    { key: "lowercase", label: "Chữ thường (a-z)" },
    { key: "number", label: "Số (0-9)" },
    { key: "special", label: "Ký tự đặc biệt" },
  ];

  return (
    <div className="password-strength mt-2">
      {/* Strength Bar */}
      <div className="flex items-center space-x-2 mb-3">
        <div className="flex-1 bg-zen-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(
              currentStrength.level
            )}`}
            style={{
              width: `${currentStrength.strength * 100}%`,
            }}
          />
        </div>
        <span
          className={`text-xs font-medium ${
            currentStrength.level === "strong"
              ? "text-success"
              : currentStrength.level === "medium"
              ? "text-warning"
              : "text-error"
          }`}
        >
          {getStrengthText(currentStrength.level)}
        </span>
      </div>

      {/* Requirements Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
        {requirements.map((req) => {
          const isValid = currentStrength.checks[req.key];
          return (
            <div
              key={req.key}
              className={`flex items-center space-x-2 transition-colors ${
                isValid ? "text-success" : "text-zen-gray-400"
              }`}
            >
              {isValid ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <AlertCircle className="h-3 w-3" />
              )}
              <span>{req.label}</span>
            </div>
          );
        })}
      </div>

      {/* Overall Score */}
      <div className="mt-2 text-xs text-zen-gray-500">
        Điểm số: {currentStrength.score}/5 yêu cầu
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
