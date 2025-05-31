import { ResponseFormatter } from '../formatters/response.js';

/**
 * CLI commands for traffic alerts
 */
export class AlertsCommands {
  constructor(client) {
    this.client = client;
  }

  /**
   * Get all alerts command
   * @param {Object} options - Command options
   * @returns {Promise<void>}
   */
  async getAll(options = {}) {
    try {
      console.log('🔄 Fetching traffic alerts...\n');
      
      const alerts = await this.client.alerts.getAll(options.format);
      
      if (options.format === 'xml') {
        console.log(alerts);
      } else {
        console.log(ResponseFormatter.formatAlerts(alerts));
      }
      
      if (options.stats && Array.isArray(alerts)) {
        const stats = await this.client.alerts.getStatistics();
        console.log(ResponseFormatter.formatStatistics(stats, 'Alert Statistics'));
      }
    } catch (error) {
      console.error(ResponseFormatter.formatError(error));
      process.exit(1);
    }
  }

  /**
   * Get alerts by area command
   * @param {string} area - Area name to filter by
   * @param {Object} options - Command options
   * @returns {Promise<void>}
   */
  async getByArea(area, options = {}) {
    try {
      console.log(`🔄 Fetching alerts for area: ${area}...\n`);
      
      const alerts = await this.client.alerts.getByArea(area, options.format);
      
      if (options.format === 'xml') {
        console.log(alerts);
      } else {
        console.log(ResponseFormatter.formatAlerts(alerts));
        
        if (Array.isArray(alerts)) {
          console.log(`\n📊 Found ${alerts.length} alerts for area: ${area}`);
        }
      }
    } catch (error) {
      console.error(ResponseFormatter.formatError(error));
      process.exit(1);
    }
  }

  /**
   * Search alerts by keywords command
   * @param {string} keywords - Keywords to search for
   * @param {Object} options - Command options
   * @returns {Promise<void>}
   */
  async search(keywords, options = {}) {
    try {
      const searchTerms = keywords.split(',').map(term => term.trim());
      console.log(`🔍 Searching alerts for: ${searchTerms.join(', ')}...\n`);
      
      const alerts = await this.client.alerts.searchByKeywords(searchTerms, options.format);
      
      if (options.format === 'xml') {
        console.log(alerts);
      } else {
        console.log(ResponseFormatter.formatAlerts(alerts));
        
        if (Array.isArray(alerts)) {
          console.log(`\n📊 Found ${alerts.length} alerts matching: ${searchTerms.join(', ')}`);
        }
      }
    } catch (error) {
      console.error(ResponseFormatter.formatError(error));
      process.exit(1);
    }
  }

  /**
   * Get alert statistics command
   * @returns {Promise<void>}
   */
  async getStatistics() {
    try {
      console.log('📊 Generating alert statistics...\n');
      
      const stats = await this.client.alerts.getStatistics();
      console.log(ResponseFormatter.formatStatistics(stats, 'Alert Statistics'));
    } catch (error) {
      console.error(ResponseFormatter.formatError(error));
      process.exit(1);
    }
  }
}
