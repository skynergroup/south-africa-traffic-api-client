import { BaseApiClient } from '../client/base.js';

/**
 * Traffic Alerts API endpoint module
 * Handles all operations related to traffic alerts
 */
export class AlertsEndpoint {
  /**
   * @param {BaseApiClient} client - Base API client instance
   */
  constructor(client) {
    this.client = client;
    this.endpoint = 'getalerts';
  }

  /**
   * Get all traffic alerts
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Array|string>} Array of alert objects (JSON) or XML string
   * 
   * @example
   * const alerts = await alertsEndpoint.getAll();
   * console.log(`Found ${alerts.length} alerts`);
   * 
   * @example
   * const alertsXml = await alertsEndpoint.getAll('xml');
   * console.log(alertsXml);
   */
  async getAll(format) {
    this.client.logger.info('Fetching all traffic alerts');
    return await this.client.makeRequest(this.endpoint, format);
  }

  /**
   * Get alerts filtered by area name
   * @param {Array|string} areaNames - Area name(s) to filter by
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Array|string>} Filtered alert objects or XML string
   * 
   * @example
   * const alerts = await alertsEndpoint.getByArea('Johannesburg');
   * const multipleAreas = await alertsEndpoint.getByArea(['Cape Town', 'Durban']);
   */
  async getByArea(areaNames, format) {
    const alerts = await this.getAll(format);
    
    if (format === 'xml' || typeof alerts === 'string') {
      this.client.logger.warn('Area filtering not supported for XML format');
      return alerts;
    }

    if (!Array.isArray(alerts)) {
      return alerts;
    }

    const searchAreas = Array.isArray(areaNames) ? areaNames : [areaNames];
    const filtered = alerts.filter(alert => {
      if (!alert.AreaNames || !Array.isArray(alert.AreaNames)) {
        return false;
      }
      
      return alert.AreaNames.some(area => 
        searchAreas.some(searchArea => 
          area.toLowerCase().includes(searchArea.toLowerCase())
        )
      );
    });

    this.client.logger.info('Filtered alerts by area', { 
      searchAreas, 
      totalAlerts: alerts.length, 
      filteredAlerts: filtered.length 
    });

    return filtered;
  }

  /**
   * Get alerts containing specific keywords in message or notes
   * @param {Array|string} keywords - Keyword(s) to search for
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Array|string>} Filtered alert objects or XML string
   * 
   * @example
   * const accidents = await alertsEndpoint.searchByKeywords('accident');
   * const roadwork = await alertsEndpoint.searchByKeywords(['roadwork', 'construction']);
   */
  async searchByKeywords(keywords, format) {
    const alerts = await this.getAll(format);
    
    if (format === 'xml' || typeof alerts === 'string') {
      this.client.logger.warn('Keyword search not supported for XML format');
      return alerts;
    }

    if (!Array.isArray(alerts)) {
      return alerts;
    }

    const searchKeywords = Array.isArray(keywords) ? keywords : [keywords];
    const filtered = alerts.filter(alert => {
      const searchText = `${alert.Message || ''} ${alert.Notes || ''}`.toLowerCase();
      
      return searchKeywords.some(keyword => 
        searchText.includes(keyword.toLowerCase())
      );
    });

    this.client.logger.info('Searched alerts by keywords', { 
      searchKeywords, 
      totalAlerts: alerts.length, 
      filteredAlerts: filtered.length 
    });

    return filtered;
  }

  /**
   * Get alert statistics
   * @returns {Promise<Object>} Alert statistics
   * 
   * @example
   * const stats = await alertsEndpoint.getStatistics();
   * console.log(`Total alerts: ${stats.total}`);
   */
  async getStatistics() {
    const alerts = await this.getAll('json');
    
    if (!Array.isArray(alerts)) {
      return { total: 0, areas: [], hasMessages: 0, hasNotes: 0 };
    }

    const areas = new Set();
    let hasMessages = 0;
    let hasNotes = 0;

    alerts.forEach(alert => {
      if (alert.AreaNames && Array.isArray(alert.AreaNames)) {
        alert.AreaNames.forEach(area => areas.add(area));
      }
      if (alert.Message) hasMessages++;
      if (alert.Notes) hasNotes++;
    });

    const stats = {
      total: alerts.length,
      areas: Array.from(areas).sort(),
      hasMessages,
      hasNotes,
      areasCount: areas.size
    };

    this.client.logger.info('Generated alert statistics', stats);
    return stats;
  }
}
