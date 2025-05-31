import { ResponseFormatter } from '../formatters/response.js';

/**
 * CLI commands for roadways
 */
export class RoadwaysCommands {
  constructor(client) {
    this.client = client;
  }

  async getAll(options = {}) {
    try {
      console.log('🔄 Fetching roadways...\n');
      const roadways = await this.client.roadways.getAll(options.format);
      
      if (options.format === 'xml') {
        console.log(roadways);
      } else {
        console.log(ResponseFormatter.formatRoadways(roadways));
      }
      
      if (options.stats && Array.isArray(roadways)) {
        const stats = await this.client.roadways.getStatistics();
        console.log(ResponseFormatter.formatStatistics(stats, 'Roadway Statistics'));
      }
    } catch (error) {
      console.error(ResponseFormatter.formatError(error));
      process.exit(1);
    }
  }

  async getByType(type, options = {}) {
    try {
      console.log(`🔄 Fetching ${type} roads...\n`);
      const roadways = await this.client.roadways.getByType(type, options.format);
      
      if (options.format === 'xml') {
        console.log(roadways);
      } else {
        console.log(ResponseFormatter.formatRoadways(roadways));
        if (Array.isArray(roadways)) {
          console.log(`\n📊 Found ${roadways.length} ${type} roads`);
        }
      }
    } catch (error) {
      console.error(ResponseFormatter.formatError(error));
      process.exit(1);
    }
  }

  async search(pattern, options = {}) {
    try {
      console.log(`🔍 Searching roadways for: ${pattern}...\n`);
      const roadways = await this.client.roadways.searchByName(pattern, options.format);
      
      if (options.format === 'xml') {
        console.log(roadways);
      } else {
        console.log(ResponseFormatter.formatRoadways(roadways));
        if (Array.isArray(roadways)) {
          console.log(`\n📊 Found ${roadways.length} roadways matching: ${pattern}`);
        }
      }
    } catch (error) {
      console.error(ResponseFormatter.formatError(error));
      process.exit(1);
    }
  }

  async getStatistics() {
    try {
      console.log('📊 Generating roadway statistics...\n');
      const stats = await this.client.roadways.getStatistics();
      console.log(ResponseFormatter.formatStatistics(stats, 'Roadway Statistics'));
    } catch (error) {
      console.error(ResponseFormatter.formatError(error));
      process.exit(1);
    }
  }
}
