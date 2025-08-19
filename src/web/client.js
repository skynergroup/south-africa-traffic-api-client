/**
 * Browser-compatible version of the i-traffic API client
 * Simplified version without Node.js dependencies
 */
export class ITrafficWebClient {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl || 'https://www.i-traffic.co.za/api';
        this.defaultFormat = config.defaultFormat || 'json';
        this.timeout = config.timeout || 10000;

        if (!this.apiKey) {
            throw new Error('API key is required');
        }

        // Initialize maps functionality (doesn't require API key)
        this.maps = new WebMapsClient();
    }

    /**
     * Validate response format
     * @private
     * @param {string} format - Format to validate
     * @returns {string} Validated format
     */
    _validateFormat(format) {
        const validFormats = ['json', 'xml'];
        const normalizedFormat = format.toLowerCase().trim();
        
        if (!validFormats.includes(normalizedFormat)) {
            throw new Error(`Invalid format: ${format}. Valid formats are: ${validFormats.join(', ')}`);
        }

        return normalizedFormat;
    }

    /**
     * Make HTTP request to the API
     * @private
     * @param {string} endpoint - API endpoint
     * @param {string} format - Response format
     * @returns {Promise<any>} API response
     */
    async _makeRequest(endpoint, format = this.defaultFormat) {
        const validatedFormat = this._validateFormat(format);
        const url = `${this.baseUrl}/${endpoint}?key=${this.apiKey}&format=${validatedFormat}`;
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': validatedFormat === 'json' ? 'application/json' : 'application/xml',
                    'User-Agent': 'i-traffic-web-client/1.0.0'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = validatedFormat === 'json' ? await response.json() : await response.text();
            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error(`Request timeout after ${this.timeout}ms`);
            }
            throw error;
        }
    }

    /**
     * Get all traffic alerts
     * @param {string} [format] - Response format (json or xml)
     * @returns {Promise<Array|string>} Array of alert objects (JSON) or XML string
     */
    async getAlerts(format) {
        return await this._makeRequest('getalerts', format);
    }

    /**
     * Get all traffic cameras
     * @param {string} [format] - Response format (json or xml)
     * @returns {Promise<Array|string>} Array of camera objects (JSON) or XML string
     */
    async getCameras(format) {
        return await this._makeRequest('getcameras', format);
    }

    /**
     * Get all traffic events
     * @param {string} [format] - Response format (json or xml)
     * @returns {Promise<Array|string>} Array of event objects (JSON) or XML string
     */
    async getEvents(format) {
        return await this._makeRequest('getevents', format);
    }

    /**
     * Get all variable message signs (VMS)
     * @param {string} [format] - Response format (json or xml)
     * @returns {Promise<Array|string>} Array of message sign objects (JSON) or XML string
     */
    async getMessageSigns(format) {
        return await this._makeRequest('getmessagesigns', format);
    }

    /**
     * Get all roadway names
     * @param {string} [format] - Response format (json or xml)
     * @returns {Promise<Array|string>} Array of roadway objects (JSON) or XML string
     */
    async getRoadways(format) {
        return await this._makeRequest('getroadways', format);
    }

    /**
     * Get all traffic data in one call
     * @param {string} [format] - Response format (json or xml)
     * @returns {Promise<Object>} Object containing all traffic data
     */
    async getAllTrafficData(format) {
        try {
            const [alerts, cameras, events, messageSigns, roadways] = await Promise.all([
                this.getAlerts(format),
                this.getCameras(format),
                this.getEvents(format),
                this.getMessageSigns(format),
                this.getRoadways(format)
            ]);

            return {
                alerts,
                cameras,
                events,
                messageSigns,
                roadways,
                timestamp: new Date().toISOString(),
                format: format || this.defaultFormat
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get client configuration
     * @returns {Object} Client configuration (safe for logging)
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

/**
 * Browser-compatible Maps client for generating embedded maps
 * Doesn't require API key as it generates iframe embed codes
 */
class WebMapsClient {
    constructor() {
        this.baseMapUrl = 'https://www.i-traffic.co.za/Map/EmbeddedMap';

        this.regions = {
            ALL: 'ALL',
            GP: 'GP',
            KZN: 'KZN',
            WC: 'WC'
        };

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

        this.sizes = {
            FULL: { value: 0, width: '810px', height: '640px', name: 'Full' },
            LARGE: { value: 1, width: '600px', height: '480px', name: 'Large' },
            SMALL: { value: 2, width: '400px', height: '320px', name: 'Small' },
            ALERT_TICKER: { value: 3, width: '100%', height: '60px', name: 'Alert Ticker' }
        };
    }

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

        return `<iframe ${attributeString}></iframe>`;
    }

    generateEmbedUrl(options = {}) {
        const config = this._validateAndNormalizeOptions(options);
        return this._buildMapUrl(config);
    }

    getAvailableRegions() {
        return {
            ALL: 'All Regions',
            GP: 'Gauteng',
            KZN: 'KwaZulu-Natal',
            WC: 'Western Cape'
        };
    }

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

    _validateAndNormalizeOptions(options) {
        const config = {
            region: options.region || 'ALL',
            layers: options.layers || Object.values(this.layers),
            size: options.size || 'FULL',
            width: options.width,
            height: options.height,
            iframeAttributes: options.iframeAttributes || {}
        };

        if (!this.regions[config.region]) {
            throw new Error(`Invalid region: ${config.region}`);
        }

        if (!this.sizes[config.size]) {
            throw new Error(`Invalid size: ${config.size}`);
        }

        if (!Array.isArray(config.layers)) {
            config.layers = [config.layers];
        }

        const validLayers = Object.values(this.layers);
        const invalidLayers = config.layers.filter(layer => !validLayers.includes(layer));
        if (invalidLayers.length > 0) {
            throw new Error(`Invalid layers: ${invalidLayers.join(', ')}`);
        }

        return config;
    }

    _buildMapUrl(config) {
        const params = new URLSearchParams();
        params.append('region', config.region);
        params.append('layers', config.layers.join(','));
        params.append('size', this.sizes[config.size].value);

        return `${this.baseMapUrl}?${params.toString()}`;
    }
}
