import { BaseApiClient } from '../client/base.js';

/**
 * Traffic Events API endpoint module
 * Handles all operations related to traffic events
 */
export class EventsEndpoint {
  /**
   * @param {BaseApiClient} client - Base API client instance
   */
  constructor(client) {
    this.client = client;
    this.endpoint = 'getevents';
  }

  /**
   * Get all traffic events
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Array|string>} Array of event objects (JSON) or XML string
   * 
   * @example
   * const events = await eventsEndpoint.getAll();
   * console.log(`Found ${events.length} events`);
   */
  async getAll(format) {
    this.client.logger.info('Fetching all traffic events');
    return await this.client.makeRequest(this.endpoint, format);
  }

  /**
   * Get events by type
   * @param {string} eventType - Event type to filter by
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Array|string>} Filtered event objects or XML string
   * 
   * @example
   * const accidents = await eventsEndpoint.getByType('accidentsAndIncidents');
   * const roadwork = await eventsEndpoint.getByType('roadwork');
   */
  async getByType(eventType, format) {
    const events = await this.getAll(format);
    
    if (format === 'xml' || typeof events === 'string') {
      this.client.logger.warn('Type filtering not supported for XML format');
      return events;
    }

    if (!Array.isArray(events)) {
      return events;
    }

    const filtered = events.filter(event => 
      event.EventType && 
      event.EventType.toLowerCase() === eventType.toLowerCase()
    );

    this.client.logger.info('Filtered events by type', { 
      eventType, 
      totalEvents: events.length, 
      filteredEvents: filtered.length 
    });

    return filtered;
  }

  /**
   * Get events by severity
   * @param {string} severity - Severity level to filter by
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Array|string>} Filtered event objects or XML string
   * 
   * @example
   * const highSeverity = await eventsEndpoint.getBySeverity('High');
   */
  async getBySeverity(severity, format) {
    const events = await this.getAll(format);
    
    if (format === 'xml' || typeof events === 'string') {
      this.client.logger.warn('Severity filtering not supported for XML format');
      return events;
    }

    if (!Array.isArray(events)) {
      return events;
    }

    const filtered = events.filter(event => 
      event.Severity && 
      event.Severity.toLowerCase().includes(severity.toLowerCase())
    );

    this.client.logger.info('Filtered events by severity', { 
      severity, 
      totalEvents: events.length, 
      filteredEvents: filtered.length 
    });

    return filtered;
  }

  /**
   * Get events by roadway
   * @param {string} roadwayName - Roadway name to filter by
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Array|string>} Filtered event objects or XML string
   * 
   * @example
   * const n1Events = await eventsEndpoint.getByRoadway('N1');
   */
  async getByRoadway(roadwayName, format) {
    const events = await this.getAll(format);
    
    if (format === 'xml' || typeof events === 'string') {
      this.client.logger.warn('Roadway filtering not supported for XML format');
      return events;
    }

    if (!Array.isArray(events)) {
      return events;
    }

    const filtered = events.filter(event => 
      event.RoadwayName && 
      event.RoadwayName.toLowerCase().includes(roadwayName.toLowerCase())
    );

    this.client.logger.info('Filtered events by roadway', { 
      roadwayName, 
      totalEvents: events.length, 
      filteredEvents: filtered.length 
    });

    return filtered;
  }

  /**
   * Get active events (not ended)
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Array|string>} Active event objects or XML string
   * 
   * @example
   * const activeEvents = await eventsEndpoint.getActive();
   */
  async getActive(format) {
    const events = await this.getAll(format);
    
    if (format === 'xml' || typeof events === 'string') {
      this.client.logger.warn('Active filtering not supported for XML format');
      return events;
    }

    if (!Array.isArray(events)) {
      return events;
    }

    const now = new Date();
    const filtered = events.filter(event => {
      if (!event.PlannedEndDate) {
        return true; // No end date means it's ongoing
      }
      
      try {
        // Parse the date format: dd/MM/yyyy HH:mm:ss
        const [datePart, timePart] = event.PlannedEndDate.split(' ');
        const [day, month, year] = datePart.split('/');
        const endDate = new Date(`${year}-${month}-${day}T${timePart}`);
        return endDate > now;
      } catch (error) {
        this.client.logger.warn('Failed to parse end date', { 
          eventId: event.ID, 
          endDate: event.PlannedEndDate 
        });
        return true; // Include if we can't parse the date
      }
    });

    this.client.logger.info('Filtered active events', { 
      totalEvents: events.length, 
      activeEvents: filtered.length 
    });

    return filtered;
  }

  /**
   * Get events within a geographic bounding box
   * @param {Object} bounds - Bounding box coordinates
   * @param {number} bounds.north - Northern latitude
   * @param {number} bounds.south - Southern latitude
   * @param {number} bounds.east - Eastern longitude
   * @param {number} bounds.west - Western longitude
   * @param {string} [format] - Response format (json or xml)
   * @returns {Promise<Array|string>} Events within bounds or XML string
   */
  async getByBounds(bounds, format) {
    const events = await this.getAll(format);
    
    if (format === 'xml' || typeof events === 'string') {
      this.client.logger.warn('Bounds filtering not supported for XML format');
      return events;
    }

    if (!Array.isArray(events)) {
      return events;
    }

    const filtered = events.filter(event => {
      if (typeof event.Latitude !== 'number' || typeof event.Longitude !== 'number') {
        return false;
      }
      
      return event.Latitude >= bounds.south && 
             event.Latitude <= bounds.north &&
             event.Longitude >= bounds.west && 
             event.Longitude <= bounds.east;
    });

    this.client.logger.info('Filtered events by bounds', { 
      bounds, 
      totalEvents: events.length, 
      filteredEvents: filtered.length 
    });

    return filtered;
  }

  /**
   * Get event statistics
   * @returns {Promise<Object>} Event statistics
   */
  async getStatistics() {
    const events = await this.getAll('json');
    
    if (!Array.isArray(events)) {
      return { 
        total: 0, 
        active: 0, 
        types: [], 
        severities: [], 
        roadways: [] 
      };
    }

    const types = new Set();
    const severities = new Set();
    const roadways = new Set();
    let active = 0;

    const now = new Date();
    
    events.forEach(event => {
      if (event.EventType) types.add(event.EventType);
      if (event.Severity) severities.add(event.Severity);
      if (event.RoadwayName) roadways.add(event.RoadwayName);
      
      // Check if event is active
      if (!event.PlannedEndDate) {
        active++;
      } else {
        try {
          const [datePart, timePart] = event.PlannedEndDate.split(' ');
          const [day, month, year] = datePart.split('/');
          const endDate = new Date(`${year}-${month}-${day}T${timePart}`);
          if (endDate > now) active++;
        } catch (error) {
          active++; // Count as active if we can't parse the date
        }
      }
    });

    const stats = {
      total: events.length,
      active,
      types: Array.from(types).sort(),
      severities: Array.from(severities).sort(),
      roadways: Array.from(roadways).sort(),
      typesCount: types.size,
      severitiesCount: severities.size,
      roadwaysCount: roadways.size
    };

    this.client.logger.info('Generated event statistics', stats);
    return stats;
  }
}
