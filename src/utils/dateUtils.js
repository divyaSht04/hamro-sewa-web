/**
 * Utility functions for handling date values in the application
 * Handles both string dates and dates in array format [year, month, day, hour, minute]
 */

/**
 * Parses a date value that might be in different formats
 * @param {any} dateValue - The date value to parse (string, array, or Date object)
 * @param {Date} fallback - Optional fallback date if parsing fails (defaults to current date)
 * @returns {Date} - A JavaScript Date object
 */
export const parseDate = (dateValue, fallback = new Date()) => {
  // If no date value at all, return the fallback
  if (!dateValue) return fallback;
  
  try {
    // Check if date is an array like [2025, 4, 11, 7, 30]
    if (Array.isArray(dateValue)) {
      // JavaScript months are 0-indexed (0 = January), but our array uses 1-indexed months
      // So we need to subtract 1 from the month value
      const [year, month, day, hour = 0, minute = 0] = dateValue;
      return new Date(year, month - 1, day, hour, minute);
    }
    
    // If it's a string or already a Date, create a new Date object
    const date = new Date(dateValue);
    
    // Validate the date
    if (isNaN(date.getTime())) {
      console.warn("Invalid date value:", dateValue);
      return fallback; // Return fallback for invalid dates
    }
    
    return date;
  } catch (error) {
    console.error("Error parsing date:", error, dateValue);
    return fallback;
  }
};

/**
 * Formats a date value to a human-readable string
 * @param {any} dateValue - The date value to format (string, array, or Date object)
 * @param {string} formatType - The format type to use ('short', 'medium', 'long', 'full')
 * @param {string} fallbackText - Text to show if date is invalid
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateValue, formatType = 'medium', fallbackText = 'Date not available') => {
  try {
    // Parse the date value using our utility function
    const date = parseDate(dateValue);
    
    // Format the date based on the requested format type
    const options = getDateFormatOptions(formatType);
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return fallbackText;
  }
};

/**
 * Get DateTimeFormat options based on format type
 * @param {string} formatType - The format type ('short', 'medium', 'long', 'full') 
 * @returns {object} - Intl.DateTimeFormat options
 */
const getDateFormatOptions = (formatType) => {
  switch (formatType) {
    case 'short':
      return {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      };
    case 'medium':
      return {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
    case 'long':
      return {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit'
      };
    case 'full':
      return {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      };
    default:
      return {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
  }
};

/**
 * Safely convert a date to ISO string format
 * @param {any} dateValue - The date value to convert
 * @param {string} fallback - Fallback string if conversion fails
 * @returns {string} - ISO date string or fallback
 */
export const toISOString = (dateValue, fallback = '') => {
  try {
    const date = parseDate(dateValue);
    return date.toISOString();
  } catch (error) {
    console.error("Error converting to ISO string:", error);
    return fallback;
  }
};

/**
 * Get just the date part of a date value (YYYY-MM-DD)
 * @param {any} dateValue - The date value to format
 * @param {string} fallback - Fallback if formatting fails
 * @returns {string} - YYYY-MM-DD format date
 */
export const getDateOnly = (dateValue, fallback = '') => {
  try {
    const isoString = toISOString(dateValue);
    return isoString.split('T')[0];
  } catch (error) {
    console.error("Error getting date only:", error);
    return fallback;
  }
};
