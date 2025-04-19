import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, AlertCircle, Star, X, ExternalLink, Clock, ArrowRight, RefreshCw } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const NotificationsWidget = () => {
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
        return <Clock size={16} className="text-blue-500" />;
      case 'BOOKING_CONFIRMED':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'BOOKING_COMPLETED':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'BOOKING_CANCELLED':
        return <X size={16} className="text-red-500" />;
      case 'SERVICE_APPROVED':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'SERVICE_REJECTED':
        return <AlertCircle size={16} className="text-red-500" />;
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
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Bell className="text-white mr-2" />
          <h3 className="text-lg text-white font-semibold">Real-Time Notifications</h3>
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
            <RefreshCw size={16} className="text-white" />
          </button>
        </div>
      </div>
      
      <div className="px-6 py-5">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : displayedNotifications.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Bell className="mx-auto mb-4 text-gray-400" size={32} />
            <p className="text-lg">No notifications yet</p>
            <p className="text-sm mt-2 max-w-md mx-auto">Notifications for new bookings, service approvals, and customer reviews will appear here</p>
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
                          className="text-sm font-medium text-gray-900 hover:text-purple-600 transition-colors"
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
                              className="text-xs text-purple-600 hover:text-purple-700"
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
            
            {notifications.length > displayCount && !showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="w-full flex justify-center items-center py-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                View all notifications <ArrowRight size={16} className="ml-1" />
              </button>
            )}
            
            {showAll && (
              <Link
                to="/service-provider/notifications"
                className="w-full flex justify-center items-center py-2.5 mt-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors text-sm font-medium"
              >
                Manage all notifications <ExternalLink size={16} className="ml-1" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsWidget;
