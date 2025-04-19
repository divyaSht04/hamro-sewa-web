import React from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationIcon = () => {
  const { unreadCount, toggleNotifications, isNotificationsOpen } = useNotifications();

  return (
    <div className="relative">
      <button
        onClick={toggleNotifications}
        className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors relative"
        aria-label="Notifications"
      >
        <Bell size={20} className={isNotificationsOpen ? 'text-primary' : 'text-gray-600'} />
        
        {/* Notification badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
              style={{ 
                minWidth: unreadCount > 9 ? '22px' : '18px', 
                height: unreadCount > 9 ? '22px' : '18px',
                padding: '2px'
              }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};

export default NotificationIcon;
