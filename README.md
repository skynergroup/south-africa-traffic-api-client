# 🚦 i-traffic South Africa API Client

A comprehensive JavaScript/Node.js client for the South African i-traffic.co.za API. Features modular architecture with CLI tools, web interface, and complete endpoint coverage for real-time traffic data including alerts, cameras, events, message signs, and roadways.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2020-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 🌟 Features

- **🏗️ Modular Architecture**: Clean separation with base client, endpoint modules, CLI interface, and web demo
- **📊 Complete API Coverage**: All 5 i-traffic endpoints (alerts, cameras, events, message signs, roadways)
- **🗺️ Embedded Maps**: Generate iframe embed codes for interactive traffic maps with customizable regions and layers
- **🖥️ CLI Tools**: Full command-line interface for all operations with formatted output
- **🌐 Web Interface**: Interactive browser-based demo application with map generation tools
- **🔧 Developer Friendly**: TypeScript-ready with comprehensive JSDoc comments
- **⚡ Performance Optimized**: Parallel requests, error handling, and timeout management
- **🔒 Secure**: Environment-based API key management
- **📱 Cross-Platform**: Works in Node.js and modern browsers
- **📚 Well Documented**: Complete API reference and usage examples

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/skynergroup/south-africa-traffic-api-client.git
cd south-africa-traffic-api-client

# Install dependencies
npm install

# Set up your API key
cp .env.example .env
# Edit .env and add your i-traffic API key
```

### Basic Usage

```javascript
import { environment } from './config/environment.js';
import { ITrafficClient } from './src/endpoints/index.js';

// Initialize client
const client = new ITrafficClient(environment.getClientConfig());

// Get traffic alerts
const alerts = await client.alerts.getAll();
console.log(`Found ${alerts.length} traffic alerts`);

// Get active cameras
const activeCameras = await client.cameras.getActive();
console.log(`Found ${activeCameras.length} active cameras`);

// Get all traffic data at once
const allData = await client.getAllTrafficData();
console.log('Complete traffic data:', allData);
```

### CLI Usage

```bash
# Get all traffic alerts
npm run cli alerts list

# Get cameras on N1 highway
npm run cli cameras roadway N1

# Get active traffic events
npm run cli events active

# Get comprehensive traffic summary
npm run cli all summary

# Search across all endpoints
npm run cli all search N1 --detailed
```

### Web Interface

```bash
# Start the web demo
npm run serve
# Opens http://localhost:8080
```

## 📁 Project Structure

```
south-africa-traffic-api-client/
├── config/
│   └── environment.js             # Environment configuration
├── src/
│   ├── client/
│   │   └── base.js                # Base API client
│   ├── endpoints/
│   │   ├── alerts.js              # Traffic alerts
│   │   ├── cameras.js             # Traffic cameras
│   │   ├── events.js              # Traffic events
│   │   ├── messageSigns.js        # Variable message signs
│   │   ├── roadways.js            # Roadway information
│   │   └── index.js               # Main client
│   ├── cli/
│   │   ├── commands/              # CLI command handlers
│   │   ├── formatters/            # Output formatters
│   │   └── index.js               # CLI entry point
│   ├── web/
│   │   ├── public/                # Web interface files
│   │   └── client.js              # Browser client
│   ├── utils/
│   │   ├── logger.js              # Logging utility
│   │   ├── validator.js           # Input validation
│   │   └── errors.js              # Custom errors
│   └── examples/
│       └── demo.js                # Demo script
├── docs/
│   ├── api-reference.md           # API documentation
│   └── examples.md               # Usage examples
└── README.md                     # This file
```

## 📋 API Endpoints

| Endpoint | Description | Module Method |
|----------|-------------|---------------|
| `/getalerts` | Traffic alerts | `client.alerts.getAll()` |
| `/getcameras` | Traffic cameras | `client.cameras.getAll()` |
| `/getevents` | Traffic events | `client.events.getAll()` |
| `/getmessagesigns` | Variable message signs | `client.messageSigns.getAll()` |
| `/getroadways` | Roadway information | `client.roadways.getAll()` |
| **Maps** | Embedded map generation | `client.maps.generateEmbedCode()` |

## 🔑 Getting an API Key

To use this client, you need an API key from i-traffic.co.za. Visit [https://www.i-traffic.co.za/developers/help](https://www.i-traffic.co.za/developers/help) for more information on obtaining access to their API.

## 🛠️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
I_TRAFFIC_API_KEY=your_actual_api_key_here
I_TRAFFIC_BASE_URL=https://www.i-traffic.co.za/api
I_TRAFFIC_DEFAULT_FORMAT=json
I_TRAFFIC_TIMEOUT=10000
I_TRAFFIC_DEBUG=false
```

### Programmatic Configuration

```javascript
import { ITrafficClient } from './src/endpoints/index.js';

const client = new ITrafficClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://www.i-traffic.co.za/api',
  defaultFormat: 'json',
  timeout: 15000,
  debug: true
});
```

## 📖 Advanced Usage

### Modular Endpoint Access

```javascript
// Get alerts for specific area
const johanAlerts = await client.alerts.getByArea('Johannesburg');

// Get cameras on specific roadway
const n1Cameras = await client.cameras.getByRoadway('N1');

// Get active events only
const activeEvents = await client.events.getActive();

// Search message signs
const roadworkSigns = await client.messageSigns.searchMessages('roadwork');

// Get roadways by type
const nationalRoads = await client.roadways.getByType('N');

// Generate embedded map
const mapEmbed = client.maps.generateEmbedCode({
  region: 'GP',
  layers: ['TrafficSpeeds', 'Cameras', 'Incidents'],
  size: 'LARGE'
});
```

### Error Handling

```javascript
import { ApiError, NetworkError, TimeoutError } from './src/utils/errors.js';

try {
  const alerts = await client.alerts.getAll();
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error ${error.statusCode}: ${error.message}`);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  } else if (error instanceof TimeoutError) {
    console.error('Request timed out:', error.message);
  }
}
```

## 🖥️ CLI Commands

```bash
# Alerts
npm run cli alerts list
npm run cli alerts area "Johannesburg"
npm run cli alerts search "accident"

# Cameras
npm run cli cameras list
npm run cli cameras roadway "N1"
npm run cli cameras active

# Events
npm run cli events list
npm run cli events type "roadwork"
npm run cli events active

# Message Signs
npm run cli signs list
npm run cli signs search "roadwork"

# Roadways
npm run cli roadways list
npm run cli roadways type "N"

# Bulk Operations
npm run cli all summary
npm run cli all search "N1" --detailed
```

## 🌐 Web Interface Features

- **Interactive API Testing**: Test all endpoints with a user-friendly interface
- **Real-time Data Display**: View formatted traffic data with statistics
- **Advanced Search**: Search across all endpoints simultaneously
- **Response Format Toggle**: Switch between JSON and XML responses
- **Error Handling**: Clear error messages and troubleshooting tips

## 📚 Documentation

- **[API Reference](docs/api-reference.md)**: Complete API documentation
- **[Usage Examples](docs/examples.md)**: Comprehensive usage examples
- **[Original API Docs](https://www.i-traffic.co.za/developers/help)**: Official i-traffic API documentation

## 🧪 Testing

```bash
# Run the demo script
npm run demo

# Test CLI functionality
npm run cli all summary

# Start web interface for manual testing
npm run serve
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Yashiel Sookdeo**
Skyner Development
📧 [development@skyner.co.za](mailto:development@skyner.co.za)
📱 +27 61 524 4668

*Developed based on the official [i-traffic.co.za API documentation](https://www.i-traffic.co.za/developers/help)*

## 🙏 Acknowledgments

- **i-traffic.co.za** for providing the comprehensive South African traffic API
- **South African traffic management authorities** for maintaining real-time traffic data
- **Open source community** for the tools and libraries that made this project possible

## 📊 Project Stats

- **Created**: May 31, 2025
- **Language**: JavaScript (ES2020+)
- **Runtime**: Node.js 14+
- **Architecture**: Modular ESM
- **API Coverage**: 100% (5/5 endpoints)

---

*For API-related issues, contact i-traffic.co.za directly. For client library issues, please open an issue in this repository.*
