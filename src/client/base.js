import { Logger } from '../utils/logger.js';
import { Validator } from '../utils/validator.js';
import { ApiError, NetworkError, TimeoutError } from '../utils/errors.js';

/**
 * Base API client that handles authentication and common request functionality
 */
export class BaseApiClient {
  /**
   * @param {Object} config - Configuration object
   * @param {string} config.apiKey - Your i-traffic API key
   * @param {string} [config.baseUrl='https://www.i-traffic.co.za/api'] - API base URL
   * @param {string} [config.defaultFormat='json'] - Default response format (json or xml)
   * @param {number} [config.timeout=10000] - Request timeout in milliseconds
   * @param {boolean} [config.debug=false] - Enable debug logging
   */
  constructor(config) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://www.i-traffic.co.za/api';
    this.defaultFormat = config.defaultFormat || 'json';
    this.timeout = config.timeout || 10000;
    this.logger = new Logger(config.debug || false);
    this.validator = new Validator();

    if (!this.apiKey) {
      throw new Error('API key is required');
    }

    this.logger.info('BaseApiClient initialized', {
      baseUrl: this.baseUrl,
      defaultFormat: this.defaultFormat,
      timeout: this.timeout
    });
  }

  /**
   * Build URL for API endpoint
   * @private
   * @param {string} endpoint - API endpoint
   * @param {string} format - Response format
   * @returns {string} Complete URL
   */
  _buildUrl(endpoint, format) {
    const validatedFormat = this.validator.validateFormat(format);
    return `${this.baseUrl}/${endpoint}?key=${this.apiKey}&format=${validatedFormat}`;
  }

  /**
   * Get request headers
   * @private
   * @param {string} format - Response format
   * @returns {Object} Request headers
   */
  _getHeaders(format) {
    return {
      'Accept': format === 'json' ? 'application/json' : 'application/xml',
      'User-Agent': 'i-traffic-api-client/1.0.0',
      'Cache-Control': 'no-cache'
    };
  }

  /**
   * Make HTTP request to the API
   * @param {string} endpoint - API endpoint
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<any>} API response
   * @throws {ApiError} For API-related errors
   * @throws {NetworkError} For network-related errors
   * @throws {TimeoutError} For timeout errors
   */
  async makeRequest(endpoint, format = this.defaultFormat) {
    const validatedFormat = this.validator.validateFormat(format);
    const url = this._buildUrl(endpoint, validatedFormat);
    const headers = this._getHeaders(validatedFormat);
    
    this.logger.debug('Making API request', { 
      url: url.replace(this.apiKey, '***'), // Hide API key in logs
      endpoint, 
      format: validatedFormat 
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        this.logger.error('API request failed', { 
          endpoint, 
          status: response.status,
          statusText: response.statusText
        });
        throw new ApiError(errorMessage, response.status, endpoint);
      }

      const data = validatedFormat === 'json' ? await response.json() : await response.text();
      
      this.logger.debug('API request successful', { 
        endpoint, 
        status: response.status,
        dataLength: Array.isArray(data) ? data.length : (typeof data === 'string' ? data.length : 'object')
      });

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        const timeoutError = new TimeoutError(`Request timeout after ${this.timeout}ms`, endpoint);
        this.logger.error('Request timeout', { endpoint, timeout: this.timeout });
        throw timeoutError;
      }
      
      if (error instanceof ApiError) {
        throw error; // Re-throw API errors as-is
      }
      
      // Handle network errors
      const networkError = new NetworkError(`Network error: ${error.message}`, endpoint);
      this.logger.error('Network error', { endpoint, error: error.message });
      throw networkError;
    }
  }

  /**
   * Make multiple requests in parallel
   * @param {Array<{endpoint: string, format?: string}>} requests - Array of request configurations
   * @returns {Promise<Array>} Array of responses
   */
  async makeParallelRequests(requests) {
    this.logger.info('Making parallel requests', { count: requests.length });
    
    const promises = requests.map(({ endpoint, format }) => 
      this.makeRequest(endpoint, format)
    );
    
    try {
      const results = await Promise.all(promises);
      this.logger.info('Parallel requests completed successfully');
      return results;
    } catch (error) {
      this.logger.error('Parallel requests failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Get client configuration (safe for logging)
   * @returns {Object} Safe configuration object
   */
  getConfig() {
    return {
      baseUrl: this.baseUrl,
      defaultFormat: this.defaultFormat,
      timeout: this.timeout,
      apiKeySet: !!this.apiKey
    };
  }
}
