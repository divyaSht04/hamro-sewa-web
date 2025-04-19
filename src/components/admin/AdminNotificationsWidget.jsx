import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, AlertCircle, Star, X, UsersRound, User, Package } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const AdminNotificationsWidget = () => {
  const { 
    notifications, 
    markAsRead, 
    deleteNotification,
    loading 
  } = useNotifications();
  
  const [showAll, setShowAll] = useState(false);
  const [displayCount, setDisplayCount] = useState(3);
  
  // Filter only unread notifications
  const unreadNotifications = notifications.filter(n => !n.isRead);
  
  // Get the notifications to display (all or limited)
  const displayedNotifications = showAll 
    ? notifications.slice(0, 10) 
    : notifications.slice(0, displayCount);

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'BOOKING_CREATED':
        return <CheckCircle size={16} className="text-blue-500" />;
      case 'SERVICE_APPROVED':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'SERVICE_REJECTED':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'SERVICE_PENDING':
        return <Package size={16} className="text-orange-500" />;
      case 'ACCOUNT_CREATED':
        return <UsersRound size={16} className="text-purple-500" />;
      case 'NEW_REVIEW':
        return <Star size={16} className="text-yellow-500" />;
      default:
        return <Bell size={16} className="text-purple-500" />;
    }
  };

  // Format date string
  const formatDate = (dateString) => {
    try {
      // Check if the date string is valid
      if (!dateString) return 'Just now';
      
      // Replace space with T to ensure proper ISO format if needed
      const formattedString = dateString.includes('T') 
        ? dateString 
        : dateString.replace(' ', 'T');
      
      const date = new Date(formattedString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Recently';
      }
      
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Recently';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Bell className="text-white mr-2" />
          <h3 className="text-lg text-white font-semibold">Admin Notifications</h3>
        </div>
        <div className="flex items-center space-x-3">
          {unreadNotifications.length > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadNotifications.length} new
            </span>
          )}
          <button 
            onClick={() => window.location.reload()} 
            className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            title="Refresh notifications"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M21 2v6h-6"></path>
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
              <path d="M3 22v-6h6"></path>
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="px-6 py-5">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : displayedNotifications.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Bell className="mx-auto mb-4 text-gray-400" size={32} />
            <p className="text-lg">No notifications yet</p>
            <p className="text-sm mt-2 max-w-md mx-auto">System notifications for new services, user registrations, and platform activity will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {displayedNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`p-4 rounded-lg border ${
                    !notification.isRead ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' : 'border-gray-200 hover:bg-gray-50'
                  } transition-colors duration-150`}
                >
                  <div className="flex items-start">
                    <div className="mt-1 mr-3">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      {notification.url ? (
                        <Link
                          to={notification.url}
                          className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                          onClick={() => markAsRead(notification.id)}
                        >
                          {notification.message}
                        </Link>
                      ) : (
                        <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                      )}
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">
                          {formatDate(notification.createdAt)}
                        </span>
                        <div className="flex space-x-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-700"
                            >
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-red-500 hover:text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {notifications.length > displayCount && !showAll ? (
              <button
                onClick={() => setShowAll(true)}
                className="w-full py-2 mt-3 bg-gray-100 text-sm text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                Show all notifications
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            ) : showAll ? (
              <button
                onClick={() => setShowAll(false)}
                className="w-full py-2 mt-3 bg-gray-100 text-sm text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                Show less
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <path d="m18 15-6-6-6 6" />
                </svg>
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotificationsWidget;
