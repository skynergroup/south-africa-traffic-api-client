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
