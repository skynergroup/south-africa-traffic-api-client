/**
 * Response formatting utilities for CLI output
 */

/**
 * Format data for console output
 */
export class ResponseFormatter {
  /**
   * Format alerts for display
   * @param {Array} alerts - Alert data
   * @returns {string} Formatted output
   */
  static formatAlerts(alerts) {
    if (!Array.isArray(alerts) || alerts.length === 0) {
      return '📋 No alerts found';
    }

    let output = `🚨 Traffic Alerts (${alerts.length})\n`;
    output += '═'.repeat(50) + '\n\n';

    alerts.forEach((alert, index) => {
      output += `${index + 1}. ${alert.Message || 'No message'}\n`;
      if (alert.Notes) {
        output += `   Notes: ${alert.Notes}\n`;
      }
      if (alert.AreaNames && alert.AreaNames.length > 0) {
        output += `   Areas: ${alert.AreaNames.join(', ')}\n`;
      }
      output += '\n';
    });

    return output;
  }

  /**
   * Format cameras for display
   * @param {Array} cameras - Camera data
   * @returns {string} Formatted output
   */
  static formatCameras(cameras) {
    if (!Array.isArray(cameras) || cameras.length === 0) {
      return '📹 No cameras found';
    }

    let output = `📹 Traffic Cameras (${cameras.length})\n`;
    output += '═'.repeat(50) + '\n\n';

    cameras.forEach((camera, index) => {
      const status = camera.Disabled ? '❌ Disabled' : camera.Blocked ? '🚫 Blocked' : '✅ Active';
      output += `${index + 1}. ${camera.Name || 'Unnamed Camera'}\n`;
      output += `   Road: ${camera.RoadwayName || 'Unknown'}\n`;
      output += `   Direction: ${camera.DirectionOfTravel || 'Unknown'}\n`;
      output += `   Status: ${status}\n`;
      if (camera.Latitude && camera.Longitude) {
        output += `   Location: ${camera.Latitude}, ${camera.Longitude}\n`;
      }
      if (camera.Url) {
        output += `   URL: ${camera.Url}\n`;
      }
      output += '\n';
    });

    return output;
  }

  /**
   * Format events for display
   * @param {Array} events - Event data
   * @returns {string} Formatted output
   */
  static formatEvents(events) {
    if (!Array.isArray(events) || events.length === 0) {
      return '🚧 No events found';
    }

    let output = `🚧 Traffic Events (${events.length})\n`;
    output += '═'.repeat(50) + '\n\n';

    events.forEach((event, index) => {
      output += `${index + 1}. ${event.Description || 'No description'}\n`;
      output += `   Type: ${event.EventType || 'Unknown'}\n`;
      if (event.EventSubType) {
        output += `   Subtype: ${event.EventSubType}\n`;
      }
      output += `   Severity: ${event.Severity || 'Unknown'}\n`;
      output += `   Road: ${event.RoadwayName || 'Unknown'}\n`;
      if (event.Location) {
        output += `   Location: ${event.Location}\n`;
      }
      if (event.LanesAffected) {
        output += `   Lanes: ${event.LanesAffected} (${event.LanesStatus || 'Unknown status'})\n`;
      }
      if (event.StartDate) {
        output += `   Started: ${event.StartDate}\n`;
      }
      if (event.PlannedEndDate) {
        output += `   Planned End: ${event.PlannedEndDate}\n`;
      }
      output += '\n';
    });

    return output;
  }

  /**
   * Format message signs for display
   * @param {Array} signs - Message sign data
   * @returns {string} Formatted output
   */
  static formatMessageSigns(signs) {
    if (!Array.isArray(signs) || signs.length === 0) {
      return '📢 No message signs found';
    }

    let output = `📢 Variable Message Signs (${signs.length})\n`;
    output += '═'.repeat(50) + '\n\n';

    signs.forEach((sign, index) => {
      output += `${index + 1}. ${sign.Name || 'Unnamed Sign'}\n`;
      output += `   Road: ${sign.Roadway || 'Unknown'}\n`;
      output += `   Direction: ${sign.DirectionOfTravel || 'Unknown'}\n`;
      if (sign.Latitude && sign.Longitude) {
        output += `   Location: ${sign.Latitude}, ${sign.Longitude}\n`;
      }
      if (sign.Messages && sign.Messages.length > 0) {
        output += `   Messages:\n`;
        sign.Messages.forEach((message, msgIndex) => {
          if (message && message.trim()) {
            output += `     ${msgIndex + 1}. ${message}\n`;
          }
        });
      } else {
        output += `   Messages: None\n`;
      }
      output += '\n';
    });

    return output;
  }

  /**
   * Format roadways for display
   * @param {Array} roadways - Roadway data
   * @returns {string} Formatted output
   */
  static formatRoadways(roadways) {
    if (!Array.isArray(roadways) || roadways.length === 0) {
      return '🛣️ No roadways found';
    }

    let output = `🛣️ Roadways (${roadways.length})\n`;
    output += '═'.repeat(50) + '\n\n';

    // Group by type
    const grouped = {
      national: [],
      regional: [],
      metropolitan: [],
      other: []
    };

    roadways.forEach(roadway => {
      const name = roadway.RoadwayName || 'Unknown';
      if (name.match(/^N\d+/i)) {
        grouped.national.push(roadway);
      } else if (name.match(/^R\d+/i)) {
        grouped.regional.push(roadway);
      } else if (name.match(/^M\d+/i)) {
        grouped.metropolitan.push(roadway);
      } else {
        grouped.other.push(roadway);
      }
    });

    // Display by category
    if (grouped.national.length > 0) {
      output += `🛤️ National Roads (${grouped.national.length}):\n`;
      grouped.national.forEach(road => {
        output += `   • ${road.RoadwayName}\n`;
      });
      output += '\n';
    }

    if (grouped.regional.length > 0) {
      output += `🛤️ Regional Roads (${grouped.regional.length}):\n`;
      grouped.regional.forEach(road => {
        output += `   • ${road.RoadwayName}\n`;
      });
      output += '\n';
    }

    if (grouped.metropolitan.length > 0) {
      output += `🛤️ Metropolitan Roads (${grouped.metropolitan.length}):\n`;
      grouped.metropolitan.forEach(road => {
        output += `   • ${road.RoadwayName}\n`;
      });
      output += '\n';
    }

    if (grouped.other.length > 0) {
      output += `🛤️ Other Roads (${grouped.other.length}):\n`;
      grouped.other.forEach(road => {
        output += `   • ${road.RoadwayName}\n`;
      });
      output += '\n';
    }

    return output;
  }

  /**
   * Format statistics for display
   * @param {Object} stats - Statistics data
   * @param {string} title - Title for the statistics
   * @returns {string} Formatted output
   */
  static formatStatistics(stats, title) {
    let output = `📊 ${title}\n`;
    output += '═'.repeat(50) + '\n\n';

    Object.entries(stats).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        output += `${key}: ${value.length} items\n`;
        if (value.length <= 10) {
          output += `   ${value.join(', ')}\n`;
        } else {
          output += `   ${value.slice(0, 10).join(', ')}... (and ${value.length - 10} more)\n`;
        }
      } else if (typeof value === 'object' && value !== null) {
        output += `${key}:\n`;
        Object.entries(value).forEach(([subKey, subValue]) => {
          output += `   ${subKey}: ${subValue}\n`;
        });
      } else {
        output += `${key}: ${value}\n`;
      }
    });

    return output;
  }

  /**
   * Format error for display
   * @param {Error} error - Error object
   * @returns {string} Formatted error output
   */
  static formatError(error) {
    let output = '❌ Error\n';
    output += '═'.repeat(50) + '\n\n';
    output += `Message: ${error.message}\n`;
    
    if (error.endpoint) {
      output += `Endpoint: ${error.endpoint}\n`;
    }
    
    if (error.statusCode) {
      output += `Status Code: ${error.statusCode}\n`;
    }
    
    if (error.timestamp) {
      output += `Time: ${error.timestamp}\n`;
    }

    return output;
  }

  /**
   * Format success message
   * @param {string} message - Success message
   * @returns {string} Formatted success output
   */
  static formatSuccess(message) {
    return `✅ ${message}\n`;
  }
}
