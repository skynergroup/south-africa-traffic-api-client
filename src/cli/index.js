#!/usr/bin/env node

import { environment } from '../../config/environment.js';
import { ITrafficClient } from '../endpoints/index.js';
import { AlertsCommands } from './commands/alerts.js';
import { CamerasCommands } from './commands/cameras.js';
import { EventsCommands } from './commands/events.js';
import { MessageSignsCommands } from './commands/messageSigns.js';
import { RoadwaysCommands } from './commands/roadways.js';
import { AllCommands } from './commands/all.js';

/**
 * Main CLI application
 */
class ITrafficCLI {
  constructor() {
    try {
      this.client = new ITrafficClient(environment.getClientConfig());
      this.alertsCommands = new AlertsCommands(this.client);
      this.camerasCommands = new CamerasCommands(this.client);
      this.eventsCommands = new EventsCommands(this.client);
      this.messageSignsCommands = new MessageSignsCommands(this.client);
      this.roadwaysCommands = new RoadwaysCommands(this.client);
      this.allCommands = new AllCommands(this.client);
    } catch (error) {
      console.error('❌ Failed to initialize CLI:', error.message);
      console.log('\n🔧 Make sure you have:');
      console.log('   1. Created a .env file with your API key');
      console.log('   2. Set I_TRAFFIC_API_KEY in your .env file');
      process.exit(1);
    }
  }

  /**
   * Parse command line arguments and execute commands
   */
  async run() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      this.showHelp();
      return;
    }

    const command = args[0];
    const subcommand = args[1];
    const options = this.parseOptions(args.slice(2));

    try {
      switch (command) {
        case 'alerts':
          await this.handleAlertsCommand(subcommand, options);
          break;
        case 'cameras':
          await this.handleCamerasCommand(subcommand, options);
          break;
        case 'events':
          await this.handleEventsCommand(subcommand, options);
          break;
        case 'signs':
          await this.handleMessageSignsCommand(subcommand, options);
          break;
        case 'roadways':
          await this.handleRoadwaysCommand(subcommand, options);
          break;
        case 'all':
          await this.handleAllCommand(subcommand, options);
          break;
        case 'help':
        case '--help':
        case '-h':
          this.showHelp();
          break;
        default:
          console.error(`❌ Unknown command: ${command}`);
          this.showHelp();
          process.exit(1);
      }
    } catch (error) {
      console.error('❌ Command failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Parse command line options
   */
  parseOptions(args) {
    const options = {};
    
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      
      if (arg === '--format' && i + 1 < args.length) {
        options.format = args[i + 1];
        i++;
      } else if (arg === '--stats') {
        options.stats = true;
      } else if (arg === '--detailed') {
        options.detailed = true;
      } else if (arg === '--xml') {
        options.format = 'xml';
      } else if (arg === '--json') {
        options.format = 'json';
      } else if (!arg.startsWith('--')) {
        options.value = arg;
      }
    }
    
    return options;
  }

  /**
   * Handle alerts commands
   */
  async handleAlertsCommand(subcommand, options) {
    switch (subcommand) {
      case 'list':
      case 'all':
        await this.alertsCommands.getAll(options);
        break;
      case 'area':
        if (!options.value) {
          console.error('❌ Area name required. Usage: alerts area <area_name>');
          process.exit(1);
        }
        await this.alertsCommands.getByArea(options.value, options);
        break;
      case 'search':
        if (!options.value) {
          console.error('❌ Search keywords required. Usage: alerts search <keywords>');
          process.exit(1);
        }
        await this.alertsCommands.search(options.value, options);
        break;
      case 'stats':
        await this.alertsCommands.getStatistics();
        break;
      default:
        await this.alertsCommands.getAll(options);
    }
  }

  /**
   * Handle cameras commands
   */
  async handleCamerasCommand(subcommand, options) {
    switch (subcommand) {
      case 'list':
      case 'all':
        await this.camerasCommands.getAll(options);
        break;
      case 'roadway':
        if (!options.value) {
          console.error('❌ Roadway name required. Usage: cameras roadway <roadway_name>');
          process.exit(1);
        }
        await this.camerasCommands.getByRoadway(options.value, options);
        break;
      case 'active':
        await this.camerasCommands.getActive(options);
        break;
      case 'stats':
        await this.camerasCommands.getStatistics();
        break;
      default:
        await this.camerasCommands.getAll(options);
    }
  }

  /**
   * Handle events commands
   */
  async handleEventsCommand(subcommand, options) {
    switch (subcommand) {
      case 'list':
      case 'all':
        await this.eventsCommands.getAll(options);
        break;
      case 'type':
        if (!options.value) {
          console.error('❌ Event type required. Usage: events type <event_type>');
          process.exit(1);
        }
        await this.eventsCommands.getByType(options.value, options);
        break;
      case 'active':
        await this.eventsCommands.getActive(options);
        break;
      case 'stats':
        await this.eventsCommands.getStatistics();
        break;
      default:
        await this.eventsCommands.getAll(options);
    }
  }

  /**
   * Handle message signs commands
   */
  async handleMessageSignsCommand(subcommand, options) {
    switch (subcommand) {
      case 'list':
      case 'all':
        await this.messageSignsCommands.getAll(options);
        break;
      case 'active':
        await this.messageSignsCommands.getWithMessages(options);
        break;
      case 'search':
        if (!options.value) {
          console.error('❌ Search keywords required. Usage: signs search <keywords>');
          process.exit(1);
        }
        await this.messageSignsCommands.search(options.value, options);
        break;
      case 'stats':
        await this.messageSignsCommands.getStatistics();
        break;
      default:
        await this.messageSignsCommands.getAll(options);
    }
  }

  /**
   * Handle roadways commands
   */
  async handleRoadwaysCommand(subcommand, options) {
    switch (subcommand) {
      case 'list':
      case 'all':
        await this.roadwaysCommands.getAll(options);
        break;
      case 'type':
        if (!options.value) {
          console.error('❌ Road type required. Usage: roadways type <N|R|M>');
          process.exit(1);
        }
        await this.roadwaysCommands.getByType(options.value, options);
        break;
      case 'search':
        if (!options.value) {
          console.error('❌ Search pattern required. Usage: roadways search <pattern>');
          process.exit(1);
        }
        await this.roadwaysCommands.search(options.value, options);
        break;
      case 'stats':
        await this.roadwaysCommands.getStatistics();
        break;
      default:
        await this.roadwaysCommands.getAll(options);
    }
  }

  /**
   * Handle all/bulk commands
   */
  async handleAllCommand(subcommand, options) {
    switch (subcommand) {
      case 'data':
        await this.allCommands.getAllData(options);
        break;
      case 'summary':
        await this.allCommands.getSummary();
        break;
      case 'search':
        if (!options.value) {
          console.error('❌ Search term required. Usage: all search <search_term>');
          process.exit(1);
        }
        await this.allCommands.search(options.value, options);
        break;
      default:
        await this.allCommands.getSummary();
    }
  }

  /**
   * Show help information
   */
  showHelp() {
    console.log(`
🚦 i-traffic CLI - South African Traffic Information

USAGE:
  itraffic <command> [subcommand] [options]

COMMANDS:
  alerts <subcommand>     Traffic alerts operations
  cameras <subcommand>    Traffic cameras operations  
  events <subcommand>     Traffic events operations
  signs <subcommand>      Message signs operations
  roadways <subcommand>   Roadways operations
  all <subcommand>        Bulk operations

SUBCOMMANDS:
  Alerts:
    list, all             Get all alerts
    area <name>           Get alerts by area
    search <keywords>     Search alerts by keywords
    stats                 Get alert statistics

  Cameras:
    list, all             Get all cameras
    roadway <name>        Get cameras by roadway
    active                Get active cameras only
    stats                 Get camera statistics

  Events:
    list, all             Get all events
    type <type>           Get events by type
    active                Get active events only
    stats                 Get event statistics

  Signs:
    list, all             Get all message signs
    active                Get signs with messages
    search <keywords>     Search sign messages
    stats                 Get sign statistics

  Roadways:
    list, all             Get all roadways
    type <N|R|M>          Get roads by type (National/Regional/Metro)
    search <pattern>      Search roadways by name
    stats                 Get roadway statistics

  All:
    data                  Get all traffic data
    summary               Get comprehensive summary
    search <term>         Search across all endpoints

OPTIONS:
  --format <json|xml>     Response format (default: json)
  --xml                   Use XML format
  --json                  Use JSON format
  --stats                 Include statistics
  --detailed              Show detailed results

EXAMPLES:
  itraffic alerts list
  itraffic cameras roadway N1
  itraffic events active --detailed
  itraffic all summary
  itraffic all search N1 --detailed
`);
  }
}

// Run CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const cli = new ITrafficCLI();
  cli.run().catch(error => {
    console.error('❌ CLI Error:', error.message);
    process.exit(1);
  });
}

export { ITrafficCLI };
