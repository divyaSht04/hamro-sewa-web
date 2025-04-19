import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { 
  initializeWebSocketConnection, 
  disconnectWebSocket, 
  getNotifications,
  markNotificationAsRead,
  markAllAsRead,
  getUnreadNotificationsCount,
  deleteNotification,
  deleteAllNotifications
} from '../services/notificationService';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get user type from user role
  const getUserType = () => {
    if (!user || !user.role) return null;
    
    if (user.role === 'ROLE_CUSTOMER') {
      return 'CUSTOMER';
    } else if (user.role === 'ROLE_SERVICE_PROVIDER') {
      return 'SERVICE_PROVIDER';
    } else if (user.role === 'ROLE_ADMIN') {
      return 'ADMIN';
    }
    return null;
  };

  // Initialize WebSocket connection when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      setLoading(true);
      const userType = getUserType();
      
      if (!userType) {
        setLoading(false);
        return;
      }

      // Handle new notifications
      const handleNewNotification = (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Show a toast for the new notification
        toast(notification.message, {
          icon: '🔔',
          duration: 5000,
          onClick: () => {
            // Mark as read and navigate if there's a URL
            markAsRead(notification.id);
            if (notification.url) {
              window.location.href = notification.url;
              console.log('Navigating to:', notification.url);
            }
          },
        });
      };

      // Connect to WebSocket
      initializeWebSocketConnection(
        user,
        handleNewNotification,
        async () => {
          // On successful connection, fetch existing notifications
          try {
            const userType = getUserType();
            if (userType) {
              const notificationsData = await getNotifications(userType);
              setNotifications(notificationsData);
              
              const count = await getUnreadNotificationsCount(userType);
              setUnreadCount(count);
            }
          } catch (error) {
            console.error('Error fetching notifications:', error);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('WebSocket connection error:', error);
          setLoading(false);
        }
      );

      // Cleanup function to disconnect WebSocket
      return () => {
        disconnectWebSocket();
      };
    } else {
      setLoading(false);
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, user]);

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      
      // Update the notifications state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true } 
            : notif
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      const userType = getUserType();
      if (!userType) return;

      await markAllAsRead(userType);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({
          ...notification,
          isRead: true
        }))
      );
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
      console.error('Error marking all as read:', error);
    }
  };
  
  // Delete a single notification
  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      
      // Update local state
      const updatedNotifications = notifications.filter(n => n.id !== notificationId);
      setNotifications(updatedNotifications);
      
      // Recalculate unread count
      const newUnreadCount = updatedNotifications.filter(n => !n.isRead).length;
      setUnreadCount(newUnreadCount);
      
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
      console.error('Error deleting notification:', error);
    }
  };
  
  // Delete all notifications
  const handleDeleteAllNotifications = async () => {
    try {
      const userType = getUserType();
      if (!userType) return;

      await deleteAllNotifications(userType);
      
      // Update local state
      setNotifications([]);
      setUnreadCount(0);
      toast.success('All notifications deleted');
    } catch (error) {
      toast.error('Failed to delete notifications');
      console.error('Error deleting all notifications:', error);
    }
  };

  // Toggle notifications panel
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  // Close notifications panel
  const closeNotifications = () => {
    setIsNotificationsOpen(false);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isNotificationsOpen,
        setIsNotificationsOpen,
        loading,
        markAsRead,
        markAllAsRead: handleMarkAllAsRead,
        deleteNotification: handleDeleteNotification,
        deleteAllNotifications: handleDeleteAllNotifications,
        toggleNotifications,
        closeNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
