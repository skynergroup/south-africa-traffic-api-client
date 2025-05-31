import { BaseApiClient } from '../client/base.js';

/**
 * Roadways API endpoint module
 * Handles all operations related to roadway information
 */
export class RoadwaysEndpoint {
  /**
   * @param {BaseApiClient} client - Base API client instance
   */
  constructor(client) {
    this.client = client;
    this.endpoint = 'getroadways';
  }

  /**
   * Get all roadway names
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Array|string>} Array of roadway objects (JSON) or XML string
   * 
   * @example
   * const roadways = await roadwaysEndpoint.getAll();
   * console.log(`Found ${roadways.length} roadways`);
   */
  async getAll(format) {
    this.client.logger.info('Fetching all roadways');
    return await this.client.makeRequest(this.endpoint, format);
  }

  /**
   * Get roadways sorted by name
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Array|string>} Sorted roadway objects or XML string
   * 
   * @example
   * const sortedRoadways = await roadwaysEndpoint.getSorted();
   */
  async getSorted(format) {
    const roadways = await this.getAll(format);
    
    if (format === 'xml' || typeof roadways === 'string') {
      this.client.logger.warn('Sorting not supported for XML format');
      return roadways;
    }

    if (!Array.isArray(roadways)) {
      return roadways;
    }

    const sorted = [...roadways].sort((a, b) => {
      const nameA = a.RoadwayName || '';
      const nameB = b.RoadwayName || '';
      return nameA.localeCompare(nameB);
    });

    this.client.logger.info('Sorted roadways by name', { 
      totalRoadways: roadways.length 
    });

    return sorted;
  }

  /**
   * Search roadways by name pattern
   * @param {string} pattern - Pattern to search for in roadway names
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Array|string>} Matching roadway objects or XML string
   * 
   * @example
   * const nationalRoads = await roadwaysEndpoint.searchByName('N');
   * const highways = await roadwaysEndpoint.searchByName('highway');
   */
  async searchByName(pattern, format) {
    const roadways = await this.getAll(format);
    
    if (format === 'xml' || typeof roadways === 'string') {
      this.client.logger.warn('Name search not supported for XML format');
      return roadways;
    }

    if (!Array.isArray(roadways)) {
      return roadways;
    }

    const filtered = roadways.filter(roadway => 
      roadway.RoadwayName && 
      roadway.RoadwayName.toLowerCase().includes(pattern.toLowerCase())
    );

    this.client.logger.info('Searched roadways by name pattern', { 
      pattern, 
      totalRoadways: roadways.length, 
      matchingRoadways: filtered.length 
    });

    return filtered;
  }

  /**
   * Get roadways by type (based on naming convention)
   * @param {string} type - Type of roadway ('N' for national, 'R' for regional, 'M' for metropolitan)
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Array|string>} Roadways of specified type or XML string
   * 
   * @example
   * const nationalRoads = await roadwaysEndpoint.getByType('N');
   * const regionalRoads = await roadwaysEndpoint.getByType('R');
   * const metroRoads = await roadwaysEndpoint.getByType('M');
   */
  async getByType(type, format) {
    const roadways = await this.getAll(format);
    
    if (format === 'xml' || typeof roadways === 'string') {
      this.client.logger.warn('Type filtering not supported for XML format');
      return roadways;
    }

    if (!Array.isArray(roadways)) {
      return roadways;
    }

    const typePattern = new RegExp(`^${type.toUpperCase()}\\d+`, 'i');
    const filtered = roadways.filter(roadway => 
      roadway.RoadwayName && 
      typePattern.test(roadway.RoadwayName)
    );

    this.client.logger.info('Filtered roadways by type', { 
      type, 
      totalRoadways: roadways.length, 
      filteredRoadways: filtered.length 
    });

    return filtered;
  }

  /**
   * Get roadway names only (simplified list)
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Array|string>} Array of roadway names or XML string
   * 
   * @example
   * const names = await roadwaysEndpoint.getNamesOnly();
   * console.log('Available roadways:', names.join(', '));
   */
  async getNamesOnly(format) {
    const roadways = await this.getAll(format);
    
    if (format === 'xml' || typeof roadways === 'string') {
      this.client.logger.warn('Name extraction not supported for XML format');
      return roadways;
    }

    if (!Array.isArray(roadways)) {
      return roadways;
    }

    const names = roadways
      .map(roadway => roadway.RoadwayName)
      .filter(name => name && name.trim() !== '')
      .sort();

    this.client.logger.info('Extracted roadway names', { 
      totalRoadways: roadways.length, 
      extractedNames: names.length 
    });

    return names;
  }

  /**
   * Get roadway statistics and categorization
   * @returns {Promise<Object>} Roadway statistics
   * 
   * @example
   * const stats = await roadwaysEndpoint.getStatistics();
   * console.log(`National roads: ${stats.national}`);
   */
  async getStatistics() {
    const roadways = await this.getAll('json');
    
    if (!Array.isArray(roadways)) {
      return { 
        total: 0, 
        national: 0, 
        regional: 0, 
        metropolitan: 0, 
        other: 0,
        categories: {}
      };
    }

    const categories = {
      national: 0,      // N roads
      regional: 0,      // R roads  
      metropolitan: 0,  // M roads
      other: 0
    };

    const typePatterns = {
      national: /^N\d+/i,
      regional: /^R\d+/i,
      metropolitan: /^M\d+/i
    };

    roadways.forEach(roadway => {
      if (!roadway.RoadwayName) {
        categories.other++;
        return;
      }

      let categorized = false;
      for (const [type, pattern] of Object.entries(typePatterns)) {
        if (pattern.test(roadway.RoadwayName)) {
          categories[type]++;
          categorized = true;
          break;
        }
      }

      if (!categorized) {
        categories.other++;
      }
    });

    const stats = {
      total: roadways.length,
      ...categories,
      sortOrders: roadways
        .map(r => r.SortOrder)
        .filter(order => typeof order === 'number')
        .sort((a, b) => a - b)
    };

    this.client.logger.info('Generated roadway statistics', stats);
    return stats;
  }

  /**
   * Validate if a roadway name exists
   * @param {string} roadwayName - Roadway name to validate
   * @returns {Promise<boolean>} True if roadway exists
   * 
   * @example
   * const exists = await roadwaysEndpoint.validateRoadway('N1');
   * if (exists) console.log('N1 is a valid roadway');
   */
  async validateRoadway(roadwayName) {
    const roadways = await this.getAll('json');
    
    if (!Array.isArray(roadways)) {
      return false;
    }

    const exists = roadways.some(roadway => 
      roadway.RoadwayName && 
      roadway.RoadwayName.toLowerCase() === roadwayName.toLowerCase()
    );

    this.client.logger.info('Validated roadway name', { 
      roadwayName, 
      exists 
    });

    return exists;
  }
}
