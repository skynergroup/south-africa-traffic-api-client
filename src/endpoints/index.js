import { BaseApiClient } from '../client/base.js';
import { AlertsEndpoint } from './alerts.js';
import { CamerasEndpoint } from './cameras.js';
import { EventsEndpoint } from './events.js';
import { MessageSignsEndpoint } from './messageSigns.js';
import { RoadwaysEndpoint } from './roadways.js';
import { MapsEndpoint } from './maps.js';

/**
 * Main API client that combines all endpoint modules
 * Provides a unified interface to all i-traffic API endpoints
 */
export class ITrafficClient {
  /**
   * @param {Object} config - Configuration object
   * @param {string} config.apiKey - Your i-traffic API key
   * @param {string} [config.baseUrl='https://www.i-traffic.co.za/api'] - API base URL
   * @param {string} [config.defaultFormat='json'] - Default response format (json or xml)
   * @param {number} [config.timeout=10000] - Request timeout in milliseconds
   * @param {boolean} [config.debug=false] - Enable debug logging
   */
  constructor(config) {
    // Initialize base client
    this.baseClient = new BaseApiClient(config);
    
    // Initialize endpoint modules
    this.alerts = new AlertsEndpoint(this.baseClient);
    this.cameras = new CamerasEndpoint(this.baseClient);
    this.events = new EventsEndpoint(this.baseClient);
    this.messageSigns = new MessageSignsEndpoint(this.baseClient);
    this.roadways = new RoadwaysEndpoint(this.baseClient);
    this.maps = new MapsEndpoint(this.baseClient);

    this.baseClient.logger.info('ITrafficClient initialized with all endpoints');
  }

  /**
   * Get all traffic data in one call
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Object>} Object containing all traffic data
   * 
   * @example
   * const allData = await client.getAllTrafficData();
   * console.log('Alerts:', allData.alerts.length);
   * console.log('Cameras:', allData.cameras.length);
   */
  async getAllTrafficData(format) {
    this.baseClient.logger.info('Fetching all traffic data');
    
    try {
      const requests = [
        { endpoint: 'getalerts', format },
        { endpoint: 'getcameras', format },
        { endpoint: 'getevents', format },
        { endpoint: 'getmessagesigns', format },
        { endpoint: 'getroadways', format }
      ];

      const [alerts, cameras, events, messageSigns, roadways] = await this.baseClient.makeParallelRequests(requests);

      const result = {
        alerts,
        cameras,
        events,
        messageSigns,
        roadways,
        timestamp: new Date().toISOString(),
        format: format || this.baseClient.defaultFormat
      };

      this.baseClient.logger.info('Successfully fetched all traffic data', {
        alertsCount: Array.isArray(alerts) ? alerts.length : 'N/A',
        camerasCount: Array.isArray(cameras) ? cameras.length : 'N/A',
        eventsCount: Array.isArray(events) ? events.length : 'N/A',
        messageSignsCount: Array.isArray(messageSigns) ? messageSigns.length : 'N/A',
        roadwaysCount: Array.isArray(roadways) ? roadways.length : 'N/A'
      });

      return result;
    } catch (error) {
      this.baseClient.logger.error('Failed to fetch all traffic data', { error: error.message });
      throw error;
    }
  }

  /**
   * Get comprehensive traffic summary
   * @returns {Promise<Object>} Traffic summary with statistics
   * 
   * @example
   * const summary = await client.getTrafficSummary();
   * console.log('Traffic Summary:', summary);
   */
  async getTrafficSummary() {
    this.baseClient.logger.info('Generating traffic summary');
    
    try {
      const [
        alertStats,
        cameraStats,
        eventStats,
        messageSignStats,
        roadwayStats
      ] = await Promise.all([
        this.alerts.getStatistics(),
        this.cameras.getStatistics(),
        this.events.getStatistics(),
        this.messageSigns.getStatistics(),
        this.roadways.getStatistics()
      ]);

      const summary = {
        timestamp: new Date().toISOString(),
        alerts: alertStats,
        cameras: cameraStats,
        events: eventStats,
        messageSigns: messageSignStats,
        roadways: roadwayStats,
        totals: {
          alerts: alertStats.total,
          cameras: cameraStats.total,
          events: eventStats.total,
          messageSigns: messageSignStats.total,
          roadways: roadwayStats.total
        }
      };

      this.baseClient.logger.info('Generated traffic summary', {
        totalAlerts: alertStats.total,
        totalCameras: cameraStats.total,
        totalEvents: eventStats.total,
        totalMessageSigns: messageSignStats.total,
        totalRoadways: roadwayStats.total
      });

      return summary;
    } catch (error) {
      this.baseClient.logger.error('Failed to generate traffic summary', { error: error.message });
      throw error;
    }
  }

  /**
   * Search across all endpoints for a specific term
   * @param {string} searchTerm - Term to search for
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Object>} Search results from all endpoints
   * 
   * @example
   * const results = await client.searchAll('N1');
   * console.log('Found in cameras:', results.cameras.length);
   */
  async searchAll(searchTerm, format) {
    this.baseClient.logger.info('Searching across all endpoints', { searchTerm });
    
    if (format === 'xml') {
      this.baseClient.logger.warn('Search not supported for XML format, returning raw data');
      return await this.getAllTrafficData(format);
    }

    try {
      const [
        alertResults,
        cameraResults,
        eventResults,
        messageSignResults,
        roadwayResults
      ] = await Promise.all([
        this.alerts.searchByKeywords(searchTerm, format),
        this.cameras.getByRoadway(searchTerm, format),
        this.events.getByRoadway(searchTerm, format),
        this.messageSigns.searchMessages(searchTerm, format),
        this.roadways.searchByName(searchTerm, format)
      ]);

      const results = {
        searchTerm,
        timestamp: new Date().toISOString(),
        alerts: alertResults,
        cameras: cameraResults,
        events: eventResults,
        messageSigns: messageSignResults,
        roadways: roadwayResults,
        totals: {
          alerts: Array.isArray(alertResults) ? alertResults.length : 0,
          cameras: Array.isArray(cameraResults) ? cameraResults.length : 0,
          events: Array.isArray(eventResults) ? eventResults.length : 0,
          messageSigns: Array.isArray(messageSignResults) ? messageSignResults.length : 0,
          roadways: Array.isArray(roadwayResults) ? roadwayResults.length : 0
        }
      };

      this.baseClient.logger.info('Search completed', {
        searchTerm,
        totalResults: Object.values(results.totals).reduce((sum, count) => sum + count, 0)
      });

      return results;
    } catch (error) {
      this.baseClient.logger.error('Search failed', { searchTerm, error: error.message });
      throw error;
    }
  }

  /**
   * Get client configuration
   * @returns {Object} Client configuration
   */
  getConfig() {
    return this.baseClient.getConfig();
  }
}

// Export individual endpoint classes for advanced usage
export {
  AlertsEndpoint,
  CamerasEndpoint,
  EventsEndpoint,
  MessageSignsEndpoint,
  RoadwaysEndpoint,
  MapsEndpoint,
  BaseApiClient
};
