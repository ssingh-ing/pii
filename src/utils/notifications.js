/**
 * Notification utility functions
 */

/**
 * Shows a toast notification to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, warning, info)
 */
export const showNotification = (message, type = 'info') => {
  // Create a simple toast notification
  const toast = document.createElement('div');
  toast.className = `notification notification-${type}`;
  toast.textContent = message;
  
  // Add styles
  const styles = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    backgroundColor: getBackgroundColor(type),
    color: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    fontSize: '14px',
    fontWeight: '500',
    zIndex: '9999',
    opacity: '0',
    transition: 'opacity 0.3s ease',
    maxWidth: '300px',
    wordWrap: 'break-word'
  };
  
  Object.assign(toast.style, styles);
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.style.opacity = '1';
  }, 100);
  
  // Remove after 5 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 5000);
};

/**
 * Gets the background color for the notification type
 * @param {string} type - The notification type
 * @returns {string} - The background color
 */
const getBackgroundColor = (type) => {
  switch (type) {
    case 'success':
      return '#4caf50';
    case 'error':
      return '#f44336';
    case 'warning':
      return '#ff9800';
    case 'info':
    default:
      return '#2196f3';
  }
};

/**
 * Shows a success notification
 * @param {string} message - The message to display
 */
export const showSuccess = (message) => {
  showNotification(message, 'success');
};

/**
 * Shows an error notification
 * @param {string} message - The message to display
 */
export const showError = (message) => {
  showNotification(message, 'error');
};

/**
 * Shows a warning notification
 * @param {string} message - The message to display
 */
export const showWarning = (message) => {
  showNotification(message, 'warning');
};

/**
 * Shows an info notification
 * @param {string} message - The message to display
 */
export const showInfo = (message) => {
  showNotification(message, 'info');
};