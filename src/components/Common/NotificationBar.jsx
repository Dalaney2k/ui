import React, { useState, useEffect, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const NotificationBar = ({ notifications, onClose }) => {
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  // Use callback to prevent unnecessary re-renders
  const handleClose = useCallback(
    (id) => {
      setVisibleNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
      if (onClose) {
        onClose(id);
      }
    },
    [onClose]
  );

  // Only update when notifications actually change
  useEffect(() => {
    setVisibleNotifications(notifications);
  }, [notifications]);

  const getIcon = useCallback((type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <AlertCircle className="w-5 h-5" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5" />;
      case "info":
      default:
        return <Info className="w-5 h-5" />;
    }
  }, []);

  const getStyles = useCallback((type) => {
    switch (type) {
      case "success":
        return "bg-green-50 text-green-800 border-green-200";
      case "error":
        return "bg-red-50 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      case "info":
      default:
        return "bg-blue-50 text-blue-800 border-blue-200";
    }
  }, []);

  if (visibleNotifications.length === 0) return null;

  // Limit to 3 most recent notifications
  const displayedNotifications = visibleNotifications.slice(-3);

  return (
    <div className="fixed top-20 right-4 z-[100] space-y-3 max-w-sm">
      {displayedNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start space-x-3 p-4 rounded-lg border shadow-xl backdrop-blur-sm transition-all duration-300 transform animate-slide-in ${getStyles(
            notification.type
          )}`}
        >
          <div className="flex-shrink-0">{getIcon(notification.type)}</div>
          <div className="flex-1">
            {notification.title && (
              <h4 className="font-semibold mb-1">{notification.title}</h4>
            )}
            <p className="text-sm">{notification.message}</p>
          </div>
          <button
            onClick={() => handleClose(notification.id)}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationBar;
