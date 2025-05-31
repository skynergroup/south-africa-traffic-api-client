import { BaseApiClient } from '../client/base.js';

/**
 * Message Signs API endpoint module
 * Handles all operations related to variable message signs (VMS)
 */
export class MessageSignsEndpoint {
  /**
   * @param {BaseApiClient} client - Base API client instance
   */
  constructor(client) {
    this.client = client;
    this.endpoint = 'getmessagesigns';
  }

  /**
   * Get all variable message signs
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Array|string>} Array of message sign objects (JSON) or XML string
   * 
   * @example
   * const signs = await messageSignsEndpoint.getAll();
   * console.log(`Found ${signs.length} message signs`);
   */
  async getAll(format) {
    this.client.logger.info('Fetching all message signs');
    return await this.client.makeRequest(this.endpoint, format);
  }

  /**
   * Get message signs by roadway
   * @param {string} roadwayName - Roadway name to filter by
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Array|string>} Filtered message sign objects or XML string
   * 
   * @example
   * const n1Signs = await messageSignsEndpoint.getByRoadway('N1');
   */
  async getByRoadway(roadwayName, format) {
    const signs = await this.getAll(format);
    
    if (format === 'xml' || typeof signs === 'string') {
      this.client.logger.warn('Roadway filtering not supported for XML format');
      return signs;
    }

    if (!Array.isArray(signs)) {
      return signs;
    }

    const filtered = signs.filter(sign => 
      sign.Roadway && 
      sign.Roadway.toLowerCase().includes(roadwayName.toLowerCase())
    );

    this.client.logger.info('Filtered message signs by roadway', { 
      roadwayName, 
      totalSigns: signs.length, 
      filteredSigns: filtered.length 
    });

    return filtered;
  }

  /**
   * Get message signs by direction of travel
   * @param {string} direction - Direction to filter by
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Array|string>} Filtered message sign objects or XML string
   * 
   * @example
   * const northbound = await messageSignsEndpoint.getByDirection('Northbound');
   */
  async getByDirection(direction, format) {
    const signs = await this.getAll(format);
    
    if (format === 'xml' || typeof signs === 'string') {
      this.client.logger.warn('Direction filtering not supported for XML format');
      return signs;
    }

    if (!Array.isArray(signs)) {
      return signs;
    }

    const filtered = signs.filter(sign => 
      sign.DirectionOfTravel && 
      sign.DirectionOfTravel.toLowerCase().includes(direction.toLowerCase())
    );

    this.client.logger.info('Filtered message signs by direction', { 
      direction, 
      totalSigns: signs.length, 
      filteredSigns: filtered.length 
    });

    return filtered;
  }

  /**
   * Get message signs with active messages
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Array|string>} Message signs with messages or XML string
   * 
   * @example
   * const activeSignsWithMessages = await messageSignsEndpoint.getWithMessages();
   */
  async getWithMessages(format) {
    const signs = await this.getAll(format);
    
    if (format === 'xml' || typeof signs === 'string') {
      this.client.logger.warn('Message filtering not supported for XML format');
      return signs;
    }

    if (!Array.isArray(signs)) {
      return signs;
    }

    const filtered = signs.filter(sign => 
      sign.Messages && 
      Array.isArray(sign.Messages) && 
      sign.Messages.length > 0 &&
      sign.Messages.some(msg => msg && msg.trim() !== '')
    );

    this.client.logger.info('Filtered message signs with active messages', { 
      totalSigns: signs.length, 
      signsWithMessages: filtered.length 
    });

    return filtered;
  }

  /**
   * Search message signs by message content
   * @param {Array|string} keywords - Keyword(s) to search for in messages
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Array|string>} Message signs with matching messages or XML string
   * 
   * @example
   * const roadworkSigns = await messageSignsEndpoint.searchMessages('roadwork');
   * const accidentSigns = await messageSignsEndpoint.searchMessages(['accident', 'incident']);
   */
  async searchMessages(keywords, format) {
    const signs = await this.getAll(format);
    
    if (format === 'xml' || typeof signs === 'string') {
      this.client.logger.warn('Message search not supported for XML format');
      return signs;
    }

    if (!Array.isArray(signs)) {
      return signs;
    }

    const searchKeywords = Array.isArray(keywords) ? keywords : [keywords];
    const filtered = signs.filter(sign => {
      if (!sign.Messages || !Array.isArray(sign.Messages)) {
        return false;
      }
      
      const allMessages = sign.Messages.join(' ').toLowerCase();
      return searchKeywords.some(keyword => 
        allMessages.includes(keyword.toLowerCase())
      );
    });

    this.client.logger.info('Searched message signs by keywords', { 
      searchKeywords, 
      totalSigns: signs.length, 
      filteredSigns: filtered.length 
    });

    return filtered;
  }

  /**
   * Get message signs within a geographic bounding box
   * @param {Object} bounds - Bounding box coordinates
   * @param {number} bounds.north - Northern latitude
   * @param {number} bounds.south - Southern latitude
   * @param {number} bounds.east - Eastern longitude
   * @param {number} bounds.west - Western longitude
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Array|string>} Message signs within bounds or XML string
   * 
   * @example
   * const bounds = { north: -25.5, south: -26.5, east: 28.5, west: 27.5 };
   * const signsInArea = await messageSignsEndpoint.getByBounds(bounds);
   */
  async getByBounds(bounds, format) {
    const signs = await this.getAll(format);
    
    if (format === 'xml' || typeof signs === 'string') {
      this.client.logger.warn('Bounds filtering not supported for XML format');
      return signs;
    }

    if (!Array.isArray(signs)) {
      return signs;
    }

    const filtered = signs.filter(sign => {
      if (typeof sign.Latitude !== 'number' || typeof sign.Longitude !== 'number') {
        return false;
      }
      
      return sign.Latitude >= bounds.south && 
             sign.Latitude <= bounds.north &&
             sign.Longitude >= bounds.west && 
             sign.Longitude <= bounds.east;
    });

    this.client.logger.info('Filtered message signs by bounds', { 
      bounds, 
      totalSigns: signs.length, 
      filteredSigns: filtered.length 
    });

    return filtered;
  }

  /**
   * Get message sign statistics
   * @returns {Promise<Object>} Message sign statistics
   * 
   * @example
   * const stats = await messageSignsEndpoint.getStatistics();
   * console.log(`Signs with messages: ${stats.withMessages}`);
   */
  async getStatistics() {
    const signs = await this.getAll('json');
    
    if (!Array.isArray(signs)) {
      return { 
        total: 0, 
        withMessages: 0, 
        totalMessages: 0, 
        roadways: [], 
        directions: [] 
      };
    }

    const roadways = new Set();
    const directions = new Set();
    let withMessages = 0;
    let totalMessages = 0;

    signs.forEach(sign => {
      if (sign.Roadway) roadways.add(sign.Roadway);
      if (sign.DirectionOfTravel) directions.add(sign.DirectionOfTravel);
      
      if (sign.Messages && Array.isArray(sign.Messages)) {
        const activeMessages = sign.Messages.filter(msg => msg && msg.trim() !== '');
        if (activeMessages.length > 0) {
          withMessages++;
          totalMessages += activeMessages.length;
        }
      }
    });

    const stats = {
      total: signs.length,
      withMessages,
      totalMessages,
      roadways: Array.from(roadways).sort(),
      directions: Array.from(directions).sort(),
      roadwaysCount: roadways.size,
      directionsCount: directions.size,
      averageMessagesPerSign: withMessages > 0 ? (totalMessages / withMessages).toFixed(2) : 0
    };

    this.client.logger.info('Generated message sign statistics', stats);
    return stats;
  }
}
