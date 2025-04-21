export const parseDate = (dateValue, fallback = new Date()) => {
  if (!dateValue) return fallback;
  
  try {
    // Check if date is an array like [2025, 4, 11, 7, 30]
    if (Array.isArray(dateValue)) {
      const [year, month, day, hour = 0, minute = 0] = dateValue;
      return new Date(year, month - 1, day, hour, minute);
    }
    
    const date = new Date(dateValue);
    
    if (isNaN(date.getTime())) {
      console.warn("Invalid date value:", dateValue);
      return fallback;
    }
    
    return date;
  } catch (error) {
    console.error("Error parsing date:", error, dateValue);
    return fallback;
  }
};


export const formatDate = (dateValue, formatType = 'medium', fallbackText = 'Date not available') => {
  try {
    const date = parseDate(dateValue);
    
    const options = getDateFormatOptions(formatType);
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return fallbackText;
  }
};


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

export const toISOString = (dateValue, fallback = '') => {
  try {
    const date = parseDate(dateValue);
    return date.toISOString();
  } catch (error) {
    console.error("Error converting to ISO string:", error);
    return fallback;
  }
};

export const getDateOnly = (dateValue, fallback = '') => {
  try {
    const isoString = toISOString(dateValue);
    return isoString.split('T')[0];
  } catch (error) {
    console.error("Error getting date only:", error);
    return fallback;
  }
};
