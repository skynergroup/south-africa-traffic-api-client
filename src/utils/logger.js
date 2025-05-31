/**
 * Simple logging utility for the i-traffic API client
 */
export class Logger {
  /**
   * @param {boolean} debug - Enable debug logging
   */
  constructor(debug = false) {
    this.debug = debug;
  }

  /**
   * Get current timestamp
   * @private
   * @returns {string} Formatted timestamp
   */
  _getTimestamp() {
    return new Date().toISOString();
  }

  /**
   * Format log message
   * @private
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} [data] - Additional data to log
   * @returns {string} Formatted log message
   */
  _formatMessage(level, message, data) {
    const timestamp = this._getTimestamp();
    const baseMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (data && Object.keys(data).length > 0) {
      return `${baseMessage} ${JSON.stringify(data)}`;
    }
    
    return baseMessage;
  }

  /**
   * Log info message
   * @param {string} message - Log message
   * @param {Object} [data] - Additional data to log
   */
  info(message, data) {
    console.log(this._formatMessage('info', message, data));
  }

  /**
   * Log error message
   * @param {string} message - Log message
   * @param {Object} [data] - Additional data to log
   */
  error(message, data) {
    console.error(this._formatMessage('error', message, data));
  }

  /**
   * Log warning message
   * @param {string} message - Log message
   * @param {Object} [data] - Additional data to log
   */
  warn(message, data) {
    console.warn(this._formatMessage('warn', message, data));
  }

  /**
   * Log debug message (only if debug is enabled)
   * @param {string} message - Log message
   * @param {Object} [data] - Additional data to log
   */
  debug(message, data) {
    if (this.debug) {
      console.debug(this._formatMessage('debug', message, data));
    }
  }
}
