/**
 * Custom error classes for the i-traffic API client
 */

/**
 * Base error class for all API-related errors
 */
export class ITrafficError extends Error {
  constructor(message, endpoint = null) {
    super(message);
    this.name = this.constructor.name;
    this.endpoint = endpoint;
    this.timestamp = new Date().toISOString();
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Get error details as object
   * @returns {Object} Error details
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      endpoint: this.endpoint,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }
}

/**
 * Error thrown when API returns an HTTP error status
 */
export class ApiError extends ITrafficError {
  constructor(message, statusCode, endpoint = null) {
    super(message, endpoint);
    this.statusCode = statusCode;
  }

  /**
   * Check if error is a client error (4xx)
   * @returns {boolean} True if client error
   */
  isClientError() {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  /**
   * Check if error is a server error (5xx)
   * @returns {boolean} True if server error
   */
  isServerError() {
    return this.statusCode >= 500 && this.statusCode < 600;
  }

  /**
   * Get error details as object
   * @returns {Object} Error details
   */
  toJSON() {
    return {
      ...super.toJSON(),
      statusCode: this.statusCode,
      isClientError: this.isClientError(),
      isServerError: this.isServerError()
    };
  }
}

/**
 * Error thrown when network request fails
 */
export class NetworkError extends ITrafficError {
  constructor(message, endpoint = null) {
    super(message, endpoint);
  }
}

/**
 * Error thrown when request times out
 */
export class TimeoutError extends ITrafficError {
  constructor(message, endpoint = null) {
    super(message, endpoint);
  }
}

/**
 * Error thrown when input validation fails
 */
export class ValidationError extends ITrafficError {
  constructor(message, field = null) {
    super(message);
    this.field = field;
  }

  /**
   * Get error details as object
   * @returns {Object} Error details
   */
  toJSON() {
    return {
      ...super.toJSON(),
      field: this.field
    };
  }
}

/**
 * Error thrown when configuration is invalid
 */
export class ConfigurationError extends ITrafficError {
  constructor(message) {
    super(message);
  }
}
