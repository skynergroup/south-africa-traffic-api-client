import { ResponseFormatter } from '../formatters/response.js';

/**
 * CLI commands for traffic cameras
 */
export class CamerasCommands {
  constructor(client) {
    this.client = client;
  }

  async getAll(options = {}) {
    try {
      console.log('🔄 Fetching traffic cameras...\n');
      const cameras = await this.client.cameras.getAll(options.format);
      
      if (options.format === 'xml') {
        console.log(cameras);
      } else {
        console.log(ResponseFormatter.formatCameras(cameras));
      }
      
      if (options.stats && Array.isArray(cameras)) {
        const stats = await this.client.cameras.getStatistics();
        console.log(ResponseFormatter.formatStatistics(stats, 'Camera Statistics'));
      }
    } catch (error) {
      console.error(ResponseFormatter.formatError(error));
      process.exit(1);
    }
  }

  async getByRoadway(roadway, options = {}) {
    try {
      console.log(`🔄 Fetching cameras for roadway: ${roadway}...\n`);
      const cameras = await this.client.cameras.getByRoadway(roadway, options.format);
      
      if (options.format === 'xml') {
        console.log(cameras);
      } else {
        console.log(ResponseFormatter.formatCameras(cameras));
        if (Array.isArray(cameras)) {
          console.log(`\n📊 Found ${cameras.length} cameras on ${roadway}`);
        }
      }
    } catch (error) {
      console.error(ResponseFormatter.formatError(error));
      process.exit(1);
    }
  }

  async getActive(options = {}) {
    try {
      console.log('🔄 Fetching active cameras...\n');
      const cameras = await this.client.cameras.getActive(options.format);
      
      if (options.format === 'xml') {
        console.log(cameras);
      } else {
        console.log(ResponseFormatter.formatCameras(cameras));
        if (Array.isArray(cameras)) {
          console.log(`\n📊 Found ${cameras.length} active cameras`);
        }
      }
    } catch (error) {
      console.error(ResponseFormatter.formatError(error));
      process.exit(1);
    }
  }

  async getStatistics() {
    try {
      console.log('📊 Generating camera statistics...\n');
      const stats = await this.client.cameras.getStatistics();
      console.log(ResponseFormatter.formatStatistics(stats, 'Camera Statistics'));
    } catch (error) {
      console.error(ResponseFormatter.formatError(error));
      process.exit(1);
    }
  }
}
