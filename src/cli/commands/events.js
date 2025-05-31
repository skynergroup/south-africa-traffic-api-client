import { ResponseFormatter } from '../formatters/response.js';

/**
 * CLI commands for traffic events
 */
export class EventsCommands {
  constructor(client) {
    this.client = client;
  }

  async getAll(options = {}) {
    try {
      console.log('🔄 Fetching traffic events...\n');
      const events = await this.client.events.getAll(options.format);
      
      if (options.format === 'xml') {
        console.log(events);
      } else {
        console.log(ResponseFormatter.formatEvents(events));
      }
      
      if (options.stats && Array.isArray(events)) {
        const stats = await this.client.events.getStatistics();
        console.log(ResponseFormatter.formatStatistics(stats, 'Event Statistics'));
      }
    } catch (error) {
      console.error(ResponseFormatter.formatError(error));
      process.exit(1);
    }
  }

  async getByType(type, options = {}) {
    try {
      console.log(`🔄 Fetching events of type: ${type}...\n`);
      const events = await this.client.events.getByType(type, options.format);
      
      if (options.format === 'xml') {
        console.log(events);
      } else {
        console.log(ResponseFormatter.formatEvents(events));
        if (Array.isArray(events)) {
          console.log(`\n📊 Found ${events.length} events of type: ${type}`);
        }
      }
    } catch (error) {
      console.error(ResponseFormatter.formatError(error));
      process.exit(1);
    }
  }

  async getActive(options = {}) {
    try {
      console.log('🔄 Fetching active events...\n');
      const events = await this.client.events.getActive(options.format);
      
      if (options.format === 'xml') {
        console.log(events);
      } else {
        console.log(ResponseFormatter.formatEvents(events));
        if (Array.isArray(events)) {
          console.log(`\n📊 Found ${events.length} active events`);
        }
      }
    } catch (error) {
      console.error(ResponseFormatter.formatError(error));
      process.exit(1);
    }
  }

  async getStatistics() {
    try {
      console.log('📊 Generating event statistics...\n');
      const stats = await this.client.events.getStatistics();
      console.log(ResponseFormatter.formatStatistics(stats, 'Event Statistics'));
    } catch (error) {
      console.error(ResponseFormatter.formatError(error));
      process.exit(1);
    }
  }
}
