import { BaseApiClient } from '../client/base.js';

/**
 * Maps endpoint module for generating embedded traffic maps
 * Handles creation of iframe embed codes for i-traffic.co.za maps
 */
export class MapsEndpoint {
  /**
   * @param {BaseApiClient} client - Base API client instance
   */
  constructor(client) {
    this.client = client;
    this.baseMapUrl = 'https://www.i-traffic.co.za/Map/EmbeddedMap';
    
    // Available regions
    this.regions = {
      ALL: 'ALL',
      GP: 'GP',    // Gauteng
      KZN: 'KZN',  // KwaZulu-Natal
      WC: 'WC'     // Western Cape
    };
    
    // Available layers
    this.layers = {
      TRAFFIC_SPEEDS: 'TrafficSpeeds',
      CAMERAS: 'Cameras',
      INCIDENTS: 'Incidents',
      CONSTRUCTION: 'Construction',
      CLOSURES: 'Closures',
      CONGESTION: 'Congestion',
      MESSAGE_SIGNS: 'MessageSigns',
      WEATHER_FORECAST: 'WeatherForecast'
    };
    
    // Size configurations
    this.sizes = {
      FULL: { value: 0, width: '810px', height: '640px', name: 'Full' },
      LARGE: { value: 1, width: '600px', height: '480px', name: 'Large' },
      SMALL: { value: 2, width: '400px', height: '320px', name: 'Small' },
      ALERT_TICKER: { value: 3, width: '100%', height: '60px', name: 'Alert Ticker' }
    };
  }

  /**
   * Generate complete iframe embed code for traffic map
   * @param {Object} [options] - Map configuration options
   * @param {string} [options.region='ALL'] - Region to display (ALL, GP, KZN, WC)
   * @param {Array<string>} [options.layers] - Layers to display
   * @param {string} [options.size='FULL'] - Map size (FULL, LARGE, SMALL, ALERT_TICKER)
   * @param {string} [options.width] - Custom width (overrides size preset)
   * @param {string} [options.height] - Custom height (overrides size preset)
   * @param {Object} [options.iframeAttributes] - Additional iframe attributes
   * @returns {string} Complete iframe HTML code
   * 
   * @example
   * const embedCode = mapsEndpoint.generateEmbedCode({
   *   region: 'GP',
   *   layers: ['TrafficSpeeds', 'Cameras', 'Incidents'],
   *   size: 'LARGE'
   * });
   */
  generateEmbedCode(options = {}) {
    const config = this._validateAndNormalizeOptions(options);
    const url = this._buildMapUrl(config);
    const sizeConfig = this.sizes[config.size];
    
    const width = config.width || sizeConfig.width;
    const height = config.height || sizeConfig.height;
    
    const iframeAttributes = {
      frameborder: '0',
      style: 'border: none; overflow: hidden;',
      scrolling: 'no',
      src: url,
      width: width,
      height: height,
      ...config.iframeAttributes
    };
    
    const attributeString = Object.entries(iframeAttributes)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    
    const embedCode = `<iframe ${attributeString}></iframe>`;
    
    this.client.logger.info('Generated embed code', {
      region: config.region,
      layers: config.layers,
      size: config.size,
      dimensions: `${width}x${height}`
    });
    
    return embedCode;
  }

  /**
   * Generate map URL for embedding
   * @param {Object} [options] - Map configuration options
   * @param {string} [options.region='ALL'] - Region to display
   * @param {Array<string>} [options.layers] - Layers to display
   * @param {string} [options.size='FULL'] - Map size
   * @returns {string} Map URL
   * 
   * @example
   * const url = mapsEndpoint.generateEmbedUrl({
   *   region: 'KZN',
   *   layers: ['Incidents', 'Closures']
   * });
   */
  generateEmbedUrl(options = {}) {
    const config = this._validateAndNormalizeOptions(options);
    return this._buildMapUrl(config);
  }

  /**
   * Get available regions
   * @returns {Object} Available regions with descriptions
   * 
   * @example
   * const regions = mapsEndpoint.getAvailableRegions();
   * console.log(regions); // { ALL: 'All Regions', GP: 'Gauteng', ... }
   */
  getAvailableRegions() {
    return {
      ALL: 'All Regions',
      GP: 'Gauteng',
      KZN: 'KwaZulu-Natal',
      WC: 'Western Cape'
    };
  }

  /**
   * Get available map layers
   * @returns {Object} Available layers with descriptions
   * 
   * @example
   * const layers = mapsEndpoint.getAvailableLayers();
   */
  getAvailableLayers() {
    return {
      TRAFFIC_SPEEDS: 'Traffic Speeds',
      CAMERAS: 'Traffic Cameras',
      INCIDENTS: 'Traffic Incidents',
      CONSTRUCTION: 'Road Construction',
      CLOSURES: 'Road Closures',
      CONGESTION: 'Traffic Congestion',
      MESSAGE_SIGNS: 'Variable Message Signs',
      WEATHER_FORECAST: 'Weather Forecasts'
    };
  }

  /**
   * Get available map sizes
   * @returns {Object} Available sizes with dimensions
   * 
   * @example
   * const sizes = mapsEndpoint.getAvailableSizes();
   */
  getAvailableSizes() {
    const result = {};
    Object.entries(this.sizes).forEach(([key, config]) => {
      result[key] = {
        name: config.name,
        width: config.width,
        height: config.height
      };
    });
    return result;
  }

  /**
   * Generate embed code with all layers enabled
   * @param {Object} [options] - Map configuration options
   * @returns {string} Complete iframe HTML code with all layers
   * 
   * @example
   * const fullMap = mapsEndpoint.generateFullMap({ region: 'GP', size: 'LARGE' });
   */
  generateFullMap(options = {}) {
    const allLayers = Object.values(this.layers);
    return this.generateEmbedCode({
      ...options,
      layers: allLayers
    });
  }

  /**
   * Generate embed code for traffic incidents only
   * @param {Object} [options] - Map configuration options
   * @returns {string} Iframe HTML code showing incidents
   * 
   * @example
   * const incidentsMap = mapsEndpoint.generateIncidentsMap({ region: 'WC' });
   */
  generateIncidentsMap(options = {}) {
    return this.generateEmbedCode({
      ...options,
      layers: [this.layers.INCIDENTS, this.layers.CLOSURES, this.layers.CONSTRUCTION]
    });
  }

  /**
   * Generate embed code for traffic flow information
   * @param {Object} [options] - Map configuration options
   * @returns {string} Iframe HTML code showing traffic flow
   * 
   * @example
   * const trafficMap = mapsEndpoint.generateTrafficFlowMap({ size: 'SMALL' });
   */
  generateTrafficFlowMap(options = {}) {
    return this.generateEmbedCode({
      ...options,
      layers: [this.layers.TRAFFIC_SPEEDS, this.layers.CONGESTION, this.layers.CAMERAS]
    });
  }

  /**
   * Validate and normalize options
   * @private
   * @param {Object} options - Raw options
   * @returns {Object} Validated and normalized options
   */
  _validateAndNormalizeOptions(options) {
    const config = {
      region: options.region || 'ALL',
      layers: options.layers || Object.values(this.layers),
      size: options.size || 'FULL',
      width: options.width,
      height: options.height,
      iframeAttributes: options.iframeAttributes || {}
    };

    // Validate region
    if (!this.regions[config.region]) {
      throw new Error(`Invalid region: ${config.region}. Available: ${Object.keys(this.regions).join(', ')}`);
    }

    // Validate size
    if (!this.sizes[config.size]) {
      throw new Error(`Invalid size: ${config.size}. Available: ${Object.keys(this.sizes).join(', ')}`);
    }

    // Validate layers
    if (!Array.isArray(config.layers)) {
      config.layers = [config.layers];
    }
    
    const validLayers = Object.values(this.layers);
    const invalidLayers = config.layers.filter(layer => !validLayers.includes(layer));
    if (invalidLayers.length > 0) {
      throw new Error(`Invalid layers: ${invalidLayers.join(', ')}. Available: ${validLayers.join(', ')}`);
    }

    return config;
  }

  /**
   * Build map URL from configuration
   * @private
   * @param {Object} config - Validated configuration
   * @returns {string} Complete map URL
   */
  _buildMapUrl(config) {
    const params = new URLSearchParams();
    params.append('region', config.region);
    params.append('layers', config.layers.join(','));
    params.append('size', this.sizes[config.size].value);

    return `${this.baseMapUrl}?${params.toString()}`;
  }

  /**
   * Get map configuration summary
   * @returns {Object} Summary of available options
   */
  getConfigurationSummary() {
    return {
      regions: this.getAvailableRegions(),
      layers: this.getAvailableLayers(),
      sizes: this.getAvailableSizes(),
      baseUrl: this.baseMapUrl
    };
  }
}
