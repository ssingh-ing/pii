/**
 * Utility functions for sanitizing HTML and text
 */

/**
 * Sanitizes HTML by removing potentially dangerous elements and attributes
 * @param {string} html - The HTML string to sanitize
 * @returns {string} - Sanitized HTML string
 */
export const sanitizeHtml = (html) => {
  if (!html) return '';
  
  // Simple HTML sanitization - remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/style\s*=\s*"[^"]*"/gi, '');
};

/**
 * Escapes HTML characters to prevent XSS
 * @param {string} text - The text to escape
 * @returns {string} - Escaped text
 */
export const escapeHtml = (text) => {
  if (!text) return '';
  
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Creates a safe HTML string for highlighting text
 * @param {string} text - The text to highlight
 * @param {string} entityType - The type of entity
 * @param {number} score - The confidence score
 * @returns {string} - Safe HTML string
 */
export const createHighlightedSpan = (text, entityType, score) => {
  const safeText = escapeHtml(text);
  const safeEntityType = escapeHtml(entityType);
  const safeScore = parseFloat(score).toFixed(2);
  
  return `<span style="background-color: #ffeb3b; padding: 2px 4px; border-radius: 3px; font-weight: bold;" title="${safeEntityType} (${safeScore})">${safeText}</span>`;
};