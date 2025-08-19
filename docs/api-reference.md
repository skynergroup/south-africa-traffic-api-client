# i-traffic API Reference

## Base Client

### BaseApiClient

The foundation client that handles authentication and common request functionality.

```javascript
import { BaseApiClient } from '../src/client/base.js';

const client = new BaseApiClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://www.i-traffic.co.za/api',
  defaultFormat: 'json',
  timeout: 10000,
  debug: false
});
```

#### Methods

- `makeRequest(endpoint, format)` - Make HTTP request to API
- `makeParallelRequests(requests)` - Make multiple requests in parallel
- `getConfig()` - Get client configuration

## Endpoint Modules

### AlertsEndpoint

Traffic alerts operations.

```javascript
import { AlertsEndpoint } from '../src/endpoints/alerts.js';

const alerts = new AlertsEndpoint(baseClient);
```

#### Methods

- `getAll(format)` - Get all traffic alerts
- `getByArea(areaNames, format)` - Get alerts filtered by area name
- `searchByKeywords(keywords, format)` - Search alerts by keywords
- `getStatistics()` - Get alert statistics

### CamerasEndpoint

Traffic cameras operations.

```javascript
import { CamerasEndpoint } from '../src/endpoints/cameras.js';

const cameras = new CamerasEndpoint(baseClient);
```

#### Methods

- `getAll(format)` - Get all traffic cameras
- `getByRoadway(roadwayName, format)` - Get cameras by roadway
- `getByDirection(direction, format)` - Get cameras by direction
- `getActive(format)` - Get active cameras only
- `getByBounds(bounds, format)` - Get cameras within geographic bounds
- `getStatistics()` - Get camera statistics

### EventsEndpoint

Traffic events operations.

```javascript
import { EventsEndpoint } from '../src/endpoints/events.js';

const events = new EventsEndpoint(baseClient);
```

#### Methods

- `getAll(format)` - Get all traffic events
- `getByType(eventType, format)` - Get events by type
- `getBySeverity(severity, format)` - Get events by severity
- `getByRoadway(roadwayName, format)` - Get events by roadway
- `getActive(format)` - Get active events only
- `getByBounds(bounds, format)` - Get events within geographic bounds
- `getStatistics()` - Get event statistics

### MessageSignsEndpoint

Variable message signs operations.

```javascript
import { MessageSignsEndpoint } from '../src/endpoints/messageSigns.js';

const messageSigns = new MessageSignsEndpoint(baseClient);
```

#### Methods

- `getAll(format)` - Get all message signs
- `getByRoadway(roadwayName, format)` - Get signs by roadway
- `getByDirection(direction, format)` - Get signs by direction
- `getWithMessages(format)` - Get signs with active messages
- `searchMessages(keywords, format)` - Search sign messages
- `getByBounds(bounds, format)` - Get signs within geographic bounds
- `getStatistics()` - Get message sign statistics

### RoadwaysEndpoint

Roadways operations.

```javascript
import { RoadwaysEndpoint } from '../src/endpoints/roadways.js';

const roadways = new RoadwaysEndpoint(baseClient);
```

#### Methods

- `getAll(format)` - Get all roadways
- `getSorted(format)` - Get roadways sorted by name
- `searchByName(pattern, format)` - Search roadways by name
- `getByType(type, format)` - Get roadways by type (N/R/M)
- `getNamesOnly(format)` - Get roadway names only
- `getStatistics()` - Get roadway statistics
- `validateRoadway(roadwayName)` - Validate roadway name

### MapsEndpoint

Embedded map generation operations.

```javascript
import { MapsEndpoint } from '../src/endpoints/maps.js';

const maps = new MapsEndpoint(baseClient);
```

#### Methods

- `generateEmbedCode(options)` - Generate complete iframe embed code
- `generateEmbedUrl(options)` - Generate map URL for embedding
- `getAvailableRegions()` - Get available regions
- `getAvailableLayers()` - Get available map layers
- `getAvailableSizes()` - Get available map sizes
- `generateFullMap(options)` - Generate embed code with all layers
- `generateIncidentsMap(options)` - Generate embed code for incidents only
- `generateTrafficFlowMap(options)` - Generate embed code for traffic flow
- `getConfigurationSummary()` - Get summary of available options

## Main Client

### ITrafficClient

Combined client with all endpoints.

```javascript
import { ITrafficClient } from '../src/endpoints/index.js';

const client = new ITrafficClient({
  apiKey: 'your-api-key',
  defaultFormat: 'json',
  timeout: 10000,
  debug: false
});
```

#### Properties

- `alerts` - AlertsEndpoint instance
- `cameras` - CamerasEndpoint instance
- `events` - EventsEndpoint instance
- `messageSigns` - MessageSignsEndpoint instance
- `roadways` - RoadwaysEndpoint instance
- `maps` - MapsEndpoint instance

#### Methods

- `getAllTrafficData(format)` - Get all traffic data in one call
- `getTrafficSummary()` - Get comprehensive traffic summary
- `searchAll(searchTerm, format)` - Search across all endpoints
- `getConfig()` - Get client configuration

## Error Classes

### ITrafficError

Base error class for all API-related errors.

### ApiError

Error thrown when API returns an HTTP error status.

Properties:
- `statusCode` - HTTP status code
- `isClientError()` - Check if 4xx error
- `isServerError()` - Check if 5xx error

### NetworkError

Error thrown when network request fails.

### TimeoutError

Error thrown when request times out.

### ValidationError

Error thrown when input validation fails.

Properties:
- `field` - Field that failed validation

### ConfigurationError

Error thrown when configuration is invalid.

## Response Formats

### JSON Format

All endpoints return JSON arrays or objects when format is 'json'.

### XML Format

All endpoints return XML strings when format is 'xml'.

## Geographic Bounds

For methods that accept bounds, use this format:

```javascript
const bounds = {
  north: -25.5,   // Northern latitude
  south: -26.5,   // Southern latitude
  east: 28.5,     // Eastern longitude
  west: 27.5      // Western longitude
};
```

## Event Types

Common event types:
- `accidentsAndIncidents`
- `roadwork`
- `specialEvents`
- `closures`
- `transitMode`
- `generalInfo`
- `winterDrivingIndex`

## Direction Values

Common direction values:
- `None`
- `All Directions`
- `Northbound`
- `Eastbound`
- `Southbound`
- `Westbound`
- `Inbound`
- `Outbound`
- `Both Directions`

## Road Types

Road type prefixes:
- `N` - National roads (e.g., N1, N2)
- `R` - Regional roads (e.g., R21, R24)
- `M` - Metropolitan roads (e.g., M1, M2)
