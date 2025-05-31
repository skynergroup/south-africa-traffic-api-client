import { ResponseFormatter } from '../formatters/response.js';

/**
 * CLI commands for message signs
 */
export class MessageSignsCommands {
  constructor(client) {
    this.client = client;
  }

  async getAll(options = {}) {
    try {
      console.log('🔄 Fetching message signs...\n');
      const signs = await this.client.messageSigns.getAll(options.format);
      
      if (options.format === 'xml') {
        console.log(signs);
      } else {
        console.log(ResponseFormatter.formatMessageSigns(signs));
      }
      
      if (options.stats && Array.isArray(signs)) {
        const stats = await this.client.messageSigns.getStatistics();
        console.log(ResponseFormatter.formatStatistics(stats, 'Message Sign Statistics'));
      }
    } catch (error) {
      console.error(ResponseFormatter.formatError(error));
      process.exit(1);
    }
  }

  async getWithMessages(options = {}) {
    try {
      console.log('🔄 Fetching message signs with active messages...\n');
      const signs = await this.client.messageSigns.getWithMessages(options.format);
      
      if (options.format === 'xml') {
        console.log(signs);
      } else {
        console.log(ResponseFormatter.formatMessageSigns(signs));
        if (Array.isArray(signs)) {
          console.log(`\n📊 Found ${signs.length} signs with active messages`);
        }
      }
    } catch (error) {
      console.error(ResponseFormatter.formatError(error));
      process.exit(1);
    }
  }

  async search(keywords, options = {}) {
    try {
      const searchTerms = keywords.split(',').map(term => term.trim());
      console.log(`🔍 Searching message signs for: ${searchTerms.join(', ')}...\n`);
      
      const signs = await this.client.messageSigns.searchMessages(searchTerms, options.format);
      
      if (options.format === 'xml') {
        console.log(signs);
      } else {
        console.log(ResponseFormatter.formatMessageSigns(signs));
        if (Array.isArray(signs)) {
          console.log(`\n📊 Found ${signs.length} signs matching: ${searchTerms.join(', ')}`);
        }
      }
    } catch (error) {
      console.error(ResponseFormatter.formatError(error));
      process.exit(1);
    }
  }

  async getStatistics() {
    try {
      console.log('📊 Generating message sign statistics...\n');
      const stats = await this.client.messageSigns.getStatistics();
      console.log(ResponseFormatter.formatStatistics(stats, 'Message Sign Statistics'));
    } catch (error) {
      console.error(ResponseFormatter.formatError(error));
      process.exit(1);
    }
  }
}
