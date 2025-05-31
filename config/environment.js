import dotenv from 'dotenv';
import { Validator } from '../src/utils/validator.js';

// Load environment variables
dotenv.config();

/**
 * Environment configuration loader and validator
 */
export class Environment {
  constructor() {
    this.validator = new Validator();
    this._loadConfig();
  }

  /**
   * Load and validate configuration from environment variables
   * @private
   */
  _loadConfig() {
    // Required configuration
    this.apiKey = this._getRequired('I_TRAFFIC_API_KEY');
    
    // Optional configuration with defaults
    this.baseUrl = this._getOptional('I_TRAFFIC_BASE_URL', 'https://www.i-traffic.co.za/api');
    this.defaultFormat = this._getOptional('I_TRAFFIC_DEFAULT_FORMAT', 'json');
    this.timeout = parseInt(this._getOptional('I_TRAFFIC_TIMEOUT', '10000'));
    this.debug = this._getOptional('I_TRAFFIC_DEBUG', 'false').toLowerCase() === 'true';
    
    // Validate configuration
    this._validateConfig();
  }

  /**
   * Get required environment variable
   * @private
   * @param {string} key - Environment variable key
   * @returns {string} Environment variable value
   * @throws {Error} If environment variable is not set
   */
  _getRequired(key) {
    const value = process.env[key];
    if (!value || value.trim() === '') {
      throw new Error(`Required environment variable ${key} is not set. Please check your .env file.`);
    }
    return value.trim();
  }

  /**
   * Get optional environment variable with default
   * @private
   * @param {string} key - Environment variable key
   * @param {string} defaultValue - Default value if not set
   * @returns {string} Environment variable value or default
   */
  _getOptional(key, defaultValue) {
    const value = process.env[key];
    return value && value.trim() !== '' ? value.trim() : defaultValue;
  }

  /**
   * Validate loaded configuration
   * @private
   * @throws {Error} If configuration is invalid
   */
  _validateConfig() {
    try {
      this.validator.validateApiKey(this.apiKey);
      this.validator.validateUrl(this.baseUrl);
      this.validator.validateFormat(this.defaultFormat);
      this.validator.validateTimeout(this.timeout);
    } catch (error) {
      throw new Error(`Configuration validation failed: ${error.message}`);
    }
  }

  /**
   * Get client configuration object
   * @returns {Object} Configuration object for API client
   */
  getClientConfig() {
    return {
      apiKey: this.apiKey,
      baseUrl: this.baseUrl,
      defaultFormat: this.defaultFormat,
      timeout: this.timeout,
      debug: this.debug
    };
  }

  /**
   * Get configuration summary for logging
   * @returns {Object} Safe configuration object (without sensitive data)
   */
  getSafeConfig() {
    return {
      baseUrl: this.baseUrl,
      defaultFormat: this.defaultFormat,
      timeout: this.timeout,
      debug: this.debug,
      apiKeySet: !!this.apiKey
    };
  }
}

// Export singleton instance
export const environment = new Environment();
