/**
 * Input validation utilities for the i-traffic API client
 */
export class Validator {
  /**
   * Valid response formats supported by the API
   */
  static VALID_FORMATS = ['json', 'xml'];

  /**
   * Validate response format
   * @param {string} format - Format to validate
   * @returns {string} Validated format
   * @throws {Error} If format is invalid
   */
  validateFormat(format) {
    if (!format || typeof format !== 'string') {
      throw new Error('Format must be a non-empty string');
    }

    const normalizedFormat = format.toLowerCase().trim();
    
    if (!Validator.VALID_FORMATS.includes(normalizedFormat)) {
      throw new Error(`Invalid format: ${format}. Valid formats are: ${Validator.VALID_FORMATS.join(', ')}`);
    }

    return normalizedFormat;
  }

  /**
   * Validate API key
   * @param {string} apiKey - API key to validate
   * @returns {string} Validated API key
   * @throws {Error} If API key is invalid
   */
  validateApiKey(apiKey) {
    if (!apiKey || typeof apiKey !== 'string') {
      throw new Error('API key must be a non-empty string');
    }

    const trimmedKey = apiKey.trim();
    
    if (trimmedKey.length === 0) {
      throw new Error('API key cannot be empty');
    }

    return trimmedKey;
  }

  /**
   * Validate URL
   * @param {string} url - URL to validate
   * @returns {string} Validated URL
   * @throws {Error} If URL is invalid
   */
  validateUrl(url) {
    if (!url || typeof url !== 'string') {
      throw new Error('URL must be a non-empty string');
    }

    try {
      new URL(url);
      return url;
    } catch (error) {
      throw new Error(`Invalid URL: ${url}`);
    }
  }

  /**
   * Validate timeout value
   * @param {number} timeout - Timeout in milliseconds
   * @returns {number} Validated timeout
   * @throws {Error} If timeout is invalid
   */
  validateTimeout(timeout) {
    if (typeof timeout !== 'number' || isNaN(timeout)) {
      throw new Error('Timeout must be a number');
    }

    if (timeout <= 0) {
      throw new Error('Timeout must be greater than 0');
    }

    if (timeout > 300000) { // 5 minutes max
      throw new Error('Timeout cannot exceed 300000ms (5 minutes)');
    }

    return timeout;
  }
}
