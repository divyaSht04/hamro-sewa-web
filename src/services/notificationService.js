// Import polyfill first to ensure global is defined
import '../utils/websocketPolyfill';

import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8084';
const SOCKET_URL = `${API_BASE_URL}/ws`;

let stompClient = null;
let connected = false;
let subscriptions = [];

/**
 * Get the authentication headers for API requests
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Initialize WebSocket connection
 * @param {object} user - Current user object
 * @param {function} onMessageReceived - Callback when notification is received
 * @param {function} onConnect - Optional callback when connection is established
 * @param {function} onError - Optional callback for connection errors
 */
export const initializeWebSocketConnection = (user, onMessageReceived, onConnect, onError) => {
  // Close any existing connection
  if (stompClient && connected) {
    disconnectWebSocket();
  }

  // Create a new STOMP client with modern configuration
  stompClient = new Client({
    webSocketFactory: () => new SockJS(SOCKET_URL),
    debug: msg => {
      // Disable verbose logging in production
      if (process.env.NODE_ENV !== 'production') {
        console.log(msg);
      }
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000
  });

  // Set up listeners before connecting
  const userType = user.role.replace('ROLE_', '').toLowerCase();
  const userId = user.id;

  // Handle successful connection
  stompClient.onConnect = frame => {
    console.log('WebSocket connected');
    connected = true;

    const subscription = stompClient.subscribe(
      `/user/${userType}-${userId}/notifications`, 
      message => {
        const notification = JSON.parse(message.body);
        onMessageReceived(notification);
      }
    );

    // Store subscription for later cleanup
    subscriptions.push(subscription);

    // Also subscribe to general notifications for this user type
    const topicSubscription = stompClient.subscribe(
      `/topic/${userType}`, 
      message => {
        const notification = JSON.parse(message.body);
        onMessageReceived(notification);
      }
    );
    
    subscriptions.push(topicSubscription);

    if (onConnect) {
      onConnect();
    }
  };

  stompClient.onStompError = frame => {
    console.error('STOMP error:', frame.headers.message);
    connected = false;
    if (onError) {
      onError(frame);
    }
  };

  // Start the connection
  stompClient.activate();

  return () => disconnectWebSocket();
};

/**
 * Disconnect WebSocket connection
 */
export const disconnectWebSocket = () => {
  if (stompClient) {
    // Unsubscribe from all subscriptions
    try {
      subscriptions.forEach(subscription => {
        if (subscription && subscription.id) {
          subscription.unsubscribe();
        }
      });
      
      // Clear subscriptions array
      subscriptions = [];
      
      // Deactivate the client
      if (connected) {
        stompClient.deactivate();
        connected = false;
        console.log('WebSocket disconnected');
      }
    } catch (error) {
      console.error('Error disconnecting WebSocket:', error);
    }
  }
};

/**
 * Check if WebSocket is connected
 */
export const isWebSocketConnected = () => {
  return connected && stompClient !== null;
};

/**
 * Get all notifications for the current user
 */
export const getNotifications = async (userType) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/notifications?userType=${userType}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
};

/**
 * Get unread notifications count
 */
export const getUnreadNotificationsCount = async (userType) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/notifications/unread/count?userType=${userType}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    await axios.put(`${API_BASE_URL}/api/notifications/${notificationId}/read`, null, {
      headers: getAuthHeaders()
    });
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (userType) => {
  try {
    await axios.put(`${API_BASE_URL}/api/notifications/read-all?userType=${userType}`, {}, {
      headers: getAuthHeaders()
    });
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/notifications/${notificationId}`, {
      headers: getAuthHeaders()
    });
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

/**
 * Delete all notifications for the current user
 */
export const deleteAllNotifications = async (userType) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/notifications?userType=${userType}`, {
      headers: getAuthHeaders()
    });
    return true;
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    throw error;
  }
};
