import { useState, useCallback } from "react";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((type, title, message) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      type,
      title,
      message,
      timestamp: Date.now(),
    };

    setNotifications((prev) => {
      // Remove duplicates (same message and type within 2 seconds)
      const filtered = prev.filter((n) => {
        const timeDiff = newNotification.timestamp - n.timestamp;
        return !(n.message === message && n.type === type && timeDiff < 2000);
      });

      // Keep only last 5 notifications
      const limited = [...filtered, newNotification].slice(-5);

      return limited;
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== newNotification.id)
      );
    }, 5000);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
  };
};
