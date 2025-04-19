import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Bell, ExternalLink, Clock, Trash2, AlertTriangle } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const NotificationPanel = () => {
  const { 
    notifications, 
    isNotificationsOpen, 
    closeNotifications, 
    markAsRead, 
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    loading
  } = useNotifications();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'BOOKING_CREATED':
      case 'BOOKING_CONFIRMED':
      case 'BOOKING_COMPLETED':
      case 'BOOKING_CANCELLED':
        return <Clock size={18} className="flex-shrink-0" />;
      case 'SERVICE_APPROVED':
      case 'SERVICE_REJECTED':
        return <Bell size={18} className="flex-shrink-0" />;
      case 'NEW_REVIEW':
        return <ExternalLink size={18} className="flex-shrink-0" />;
      default:
        return <Bell size={18} className="flex-shrink-0" />;
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
        console.error('Invalid date format:', dateString);
        return 'Recently';
      }
      
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Recently';
    }
  };

  return (
    <AnimatePresence>
      {isNotificationsOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
            onClick={closeNotifications}
          />
          
          {/* Notification Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-lg overflow-hidden z-50"
            style={{ maxHeight: '80vh' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary text-white">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <div className="flex gap-2">
                <button 
                  onClick={markAllAsRead}
                  className="p-1 hover:bg-primary-dark rounded transition-colors text-sm flex items-center"
                  title="Mark all as read"
                  disabled={notifications.length === 0}
                >
                  <Check size={16} className="mr-1" />
                  <span className="text-xs">Read all</span>
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-1 hover:bg-primary-dark rounded transition-colors text-sm flex items-center"
                  title="Delete all notifications"
                  disabled={notifications.length === 0}
                >
                  <Trash2 size={16} className="mr-1" />
                  <span className="text-xs">Delete all</span>
                </button>
                <button 
                  onClick={closeNotifications} 
                  className="p-1 hover:bg-primary-dark rounded transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            {/* Notification List */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 60px)' }}>
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
                  <p>Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell size={32} className="mx-auto mb-2 text-gray-400" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex">
                      <div className={`mr-3 text-primary mt-1`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        {notification.url ? (
                          <Link 
                            to={notification.url}
                            className="text-gray-800 font-medium block hover:text-primary transition-colors"
                            onClick={() => markAsRead(notification.id)}
                          >
                            {notification.message}
                          </Link>
                        ) : (
                          <div className="text-gray-800 font-medium">{notification.message}</div>
                        )}
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">
                            {formatDate(notification.createdAt)}
                          </span>
                          <div className="flex gap-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-primary hover:text-primary-dark"
                              >
                                Mark as read
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-xs text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Delete All Confirmation */}
            {showDeleteConfirm && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                <div className="bg-white p-4 rounded-lg max-w-xs w-full shadow-lg">
                  <div className="flex items-center text-red-500 mb-3">
                    <AlertTriangle className="mr-2" />
                    <h3 className="font-bold">Delete All Notifications</h3>
                  </div>
                  <p className="text-gray-700 mb-4">Are you sure you want to delete all notifications? This action cannot be undone.</p>
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        deleteAllNotifications();
                        setShowDeleteConfirm(false);
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete All
                    </button>
                  </div>
                </div>
              </div>
            )}
            
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
