import { BaseApiClient } from '../client/base.js';

/**
 * Traffic Cameras API endpoint module
 * Handles all operations related to traffic cameras
 */
export class CamerasEndpoint {
  /**
   * @param {BaseApiClient} client - Base API client instance
   */
  constructor(client) {
    this.client = client;
    this.endpoint = 'getcameras';
  }

  /**
   * Get all traffic cameras
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Array|string>} Array of camera objects (JSON) or XML string
   * 
   * @example
   * const cameras = await camerasEndpoint.getAll();
   * console.log(`Found ${cameras.length} cameras`);
   */
  async getAll(format) {
    this.client.logger.info('Fetching all traffic cameras');
    return await this.client.makeRequest(this.endpoint, format);
  }

  /**
   * Get cameras by roadway name
   * @param {string} roadwayName - Roadway name to filter by
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Array|string>} Filtered camera objects or XML string
   * 
   * @example
   * const n1Cameras = await camerasEndpoint.getByRoadway('N1');
   */
  async getByRoadway(roadwayName, format) {
    const cameras = await this.getAll(format);
    
    if (format === 'xml' || typeof cameras === 'string') {
      this.client.logger.warn('Roadway filtering not supported for XML format');
      return cameras;
    }

    if (!Array.isArray(cameras)) {
      return cameras;
    }

    const filtered = cameras.filter(camera => 
      camera.RoadwayName && 
      camera.RoadwayName.toLowerCase().includes(roadwayName.toLowerCase())
    );

    this.client.logger.info('Filtered cameras by roadway', { 
      roadwayName, 
      totalCameras: cameras.length, 
      filteredCameras: filtered.length 
    });

    return filtered;
  }

  /**
   * Get cameras by direction of travel
   * @param {string} direction - Direction to filter by
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Array|string>} Filtered camera objects or XML string
   * 
   * @example
   * const northbound = await camerasEndpoint.getByDirection('Northbound');
   */
  async getByDirection(direction, format) {
    const cameras = await this.getAll(format);
    
    if (format === 'xml' || typeof cameras === 'string') {
      this.client.logger.warn('Direction filtering not supported for XML format');
      return cameras;
    }

    if (!Array.isArray(cameras)) {
      return cameras;
    }

    const filtered = cameras.filter(camera => 
      camera.DirectionOfTravel && 
      camera.DirectionOfTravel.toLowerCase().includes(direction.toLowerCase())
    );

    this.client.logger.info('Filtered cameras by direction', { 
      direction, 
      totalCameras: cameras.length, 
      filteredCameras: filtered.length 
    });

    return filtered;
  }

  /**
   * Get active cameras (not disabled or blocked)
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Array|string>} Active camera objects or XML string
   * 
   * @example
   * const activeCameras = await camerasEndpoint.getActive();
   */
  async getActive(format) {
    const cameras = await this.getAll(format);
    
    if (format === 'xml' || typeof cameras === 'string') {
      this.client.logger.warn('Active filtering not supported for XML format');
      return cameras;
    }

    if (!Array.isArray(cameras)) {
      return cameras;
    }

    const filtered = cameras.filter(camera => 
      !camera.Disabled && !camera.Blocked
    );

    this.client.logger.info('Filtered active cameras', { 
      totalCameras: cameras.length, 
      activeCameras: filtered.length 
    });

    return filtered;
  }

  /**
   * Get cameras within a geographic bounding box
   * @param {Object} bounds - Bounding box coordinates
   * @param {number} bounds.north - Northern latitude
   * @param {number} bounds.south - Southern latitude
   * @param {number} bounds.east - Eastern longitude
   * @param {number} bounds.west - Western longitude
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Array|string>} Cameras within bounds or XML string
   * 
   * @example
   * const bounds = { north: -25.5, south: -26.5, east: 28.5, west: 27.5 };
   * const camerasInArea = await camerasEndpoint.getByBounds(bounds);
   */
  async getByBounds(bounds, format) {
    const cameras = await this.getAll(format);
    
    if (format === 'xml' || typeof cameras === 'string') {
      this.client.logger.warn('Bounds filtering not supported for XML format');
      return cameras;
    }

    if (!Array.isArray(cameras)) {
      return cameras;
    }

    const filtered = cameras.filter(camera => {
      if (typeof camera.Latitude !== 'number' || typeof camera.Longitude !== 'number') {
        return false;
      }
      
      return camera.Latitude >= bounds.south && 
             camera.Latitude <= bounds.north &&
             camera.Longitude >= bounds.west && 
             camera.Longitude <= bounds.east;
    });

    this.client.logger.info('Filtered cameras by bounds', { 
      bounds, 
      totalCameras: cameras.length, 
      filteredCameras: filtered.length 
    });

    return filtered;
  }

  /**
   * Get camera statistics
   * @returns {Promise<Object>} Camera statistics
   * 
   * @example
   * const stats = await camerasEndpoint.getStatistics();
   * console.log(`Active cameras: ${stats.active}`);
   */
  async getStatistics() {
    const cameras = await this.getAll('json');
    
    if (!Array.isArray(cameras)) {
      return { total: 0, active: 0, disabled: 0, blocked: 0, roadways: [], directions: [] };
    }

    const roadways = new Set();
    const directions = new Set();
    let active = 0;
    let disabled = 0;
    let blocked = 0;

    cameras.forEach(camera => {
      if (camera.RoadwayName) roadways.add(camera.RoadwayName);
      if (camera.DirectionOfTravel) directions.add(camera.DirectionOfTravel);
      if (camera.Disabled) disabled++;
      if (camera.Blocked) blocked++;
      if (!camera.Disabled && !camera.Blocked) active++;
    });

    const stats = {
      total: cameras.length,
      active,
      disabled,
      blocked,
      roadways: Array.from(roadways).sort(),
      directions: Array.from(directions).sort(),
      roadwaysCount: roadways.size,
      directionsCount: directions.size
    };

    this.client.logger.info('Generated camera statistics', stats);
    return stats;
  }
}
