import { ResponseFormatter } from '../formatters/response.js';

/**
 * CLI commands for bulk operations
 */
export class AllCommands {
  constructor(client) {
    this.client = client;
  }

  async getAllData(options = {}) {
    try {
      console.log('🔄 Fetching all traffic data...\n');
      const allData = await this.client.getAllTrafficData(options.format);
      
      if (options.format === 'xml') {
        console.log('=== ALERTS ===');
        console.log(allData.alerts);
        console.log('\n=== CAMERAS ===');
        console.log(allData.cameras);
        console.log('\n=== EVENTS ===');
        console.log(allData.events);
        console.log('\n=== MESSAGE SIGNS ===');
        console.log(allData.messageSigns);
        console.log('\n=== ROADWAYS ===');
        console.log(allData.roadways);
      } else {
        console.log('📊 Traffic Data Summary');
        console.log('═'.repeat(50));
        console.log(`Timestamp: ${allData.timestamp}`);
        console.log(`Format: ${allData.format}`);
        console.log(`Alerts: ${Array.isArray(allData.alerts) ? allData.alerts.length : 'N/A'}`);
        console.log(`Cameras: ${Array.isArray(allData.cameras) ? allData.cameras.length : 'N/A'}`);
        console.log(`Events: ${Array.isArray(allData.events) ? allData.events.length : 'N/A'}`);
        console.log(`Message Signs: ${Array.isArray(allData.messageSigns) ? allData.messageSigns.length : 'N/A'}`);
        console.log(`Roadways: ${Array.isArray(allData.roadways) ? allData.roadways.length : 'N/A'}`);
        
        if (options.detailed) {
          console.log('\n' + ResponseFormatter.formatAlerts(allData.alerts));
          console.log(ResponseFormatter.formatCameras(allData.cameras));
          console.log(ResponseFormatter.formatEvents(allData.events));
          console.log(ResponseFormatter.formatMessageSigns(allData.messageSigns));
          console.log(ResponseFormatter.formatRoadways(allData.roadways));
        }
      }
    } catch (error) {
      console.error(ResponseFormatter.formatError(error));
      process.exit(1);
    }
  }

  async getSummary() {
    try {
      console.log('📊 Generating comprehensive traffic summary...\n');
      const summary = await this.client.getTrafficSummary();
      
      console.log('🚦 i-traffic Summary Report');
      console.log('═'.repeat(50));
      console.log(`Generated: ${summary.timestamp}\n`);
      
      console.log('📋 ALERTS');
      console.log(`Total: ${summary.alerts.total}`);
      console.log(`Areas: ${summary.alerts.areasCount}`);
      console.log(`With Messages: ${summary.alerts.hasMessages}`);
      console.log(`With Notes: ${summary.alerts.hasNotes}\n`);
      
      console.log('📹 CAMERAS');
      console.log(`Total: ${summary.cameras.total}`);
      console.log(`Active: ${summary.cameras.active}`);
      console.log(`Disabled: ${summary.cameras.disabled}`);
      console.log(`Blocked: ${summary.cameras.blocked}`);
      console.log(`Roadways: ${summary.cameras.roadwaysCount}\n`);
      
      console.log('🚧 EVENTS');
      console.log(`Total: ${summary.events.total}`);
      console.log(`Active: ${summary.events.active}`);
      console.log(`Types: ${summary.events.typesCount}`);
      console.log(`Severities: ${summary.events.severitiesCount}\n`);
      
      console.log('📢 MESSAGE SIGNS');
      console.log(`Total: ${summary.messageSigns.total}`);
      console.log(`With Messages: ${summary.messageSigns.withMessages}`);
      console.log(`Total Messages: ${summary.messageSigns.totalMessages}`);
      console.log(`Avg Messages/Sign: ${summary.messageSigns.averageMessagesPerSign}\n`);
      
      console.log('🛣️ ROADWAYS');
      console.log(`Total: ${summary.roadways.total}`);
      console.log(`National: ${summary.roadways.national}`);
      console.log(`Regional: ${summary.roadways.regional}`);
      console.log(`Metropolitan: ${summary.roadways.metropolitan}`);
      console.log(`Other: ${summary.roadways.other}`);
      
    } catch (error) {
      console.error(ResponseFormatter.formatError(error));
      process.exit(1);
    }
  }

  async search(searchTerm, options = {}) {
    try {
      console.log(`🔍 Searching all endpoints for: ${searchTerm}...\n`);
      const results = await this.client.searchAll(searchTerm, options.format);
      
      if (options.format === 'xml') {
        console.log('Search not supported for XML format. Showing all data:');
        console.log(results);
      } else {
        console.log('🔍 Search Results');
        console.log('═'.repeat(50));
        console.log(`Search Term: ${results.searchTerm}`);
        console.log(`Timestamp: ${results.timestamp}\n`);
        
        console.log(`📋 Alerts: ${results.totals.alerts} matches`);
        console.log(`📹 Cameras: ${results.totals.cameras} matches`);
        console.log(`🚧 Events: ${results.totals.events} matches`);
        console.log(`📢 Message Signs: ${results.totals.messageSigns} matches`);
        console.log(`🛣️ Roadways: ${results.totals.roadways} matches\n`);
        
        const totalMatches = Object.values(results.totals).reduce((sum, count) => sum + count, 0);
        console.log(`🎯 Total Matches: ${totalMatches}\n`);
        
        if (options.detailed) {
          if (results.totals.alerts > 0) {
            console.log(ResponseFormatter.formatAlerts(results.alerts));
          }
          if (results.totals.cameras > 0) {
            console.log(ResponseFormatter.formatCameras(results.cameras));
          }
          if (results.totals.events > 0) {
            console.log(ResponseFormatter.formatEvents(results.events));
          }
          if (results.totals.messageSigns > 0) {
            console.log(ResponseFormatter.formatMessageSigns(results.messageSigns));
          }
          if (results.totals.roadways > 0) {
            console.log(ResponseFormatter.formatRoadways(results.roadways));
          }
        }
      }
    } catch (error) {
      console.error(ResponseFormatter.formatError(error));
      process.exit(1);
    }
  }
}
