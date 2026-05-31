/**
 * Text utility functions for the application
 */

/**
 * Truncates text to a maximum number of words and appends an ellipsis if truncated
 * 
 * @param {string} text - The text to truncate
 * @param {number} maxWords - Maximum number of words (default: 24)
 * @returns {string} - Truncated text with ellipsis if needed
 * 
 * @example
 * truncateText("This is a very long testimonial text", 5)
 * // Returns: "This is a very long..."
 */
export function truncateText(text, maxWords = 24) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Split text into words (handles multiple spaces)
  const words = text.trim().split(/\s+/);

  // If text is within limit, return as-is
  if (words.length <= maxWords) {
    return text;
  }

  // Truncate and append ellipsis
  return words.slice(0, maxWords).join(' ') + '...';
}

/**
 * Counts the number of words in a text string
 * 
 * @param {string} text - The text to count words in
 * @returns {number} - Number of words
 */
export function countWords(text) {
  if (!text || typeof text !== 'string') {
    return 0;
  }

  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}
