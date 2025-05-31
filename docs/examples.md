# Usage Examples

## Basic Setup

```javascript
import { environment } from '../config/environment.js';
import { ITrafficClient } from '../src/endpoints/index.js';

// Initialize client with environment configuration
const client = new ITrafficClient(environment.getClientConfig());
```

## Getting All Data

```javascript
// Get all traffic data at once
const allData = await client.getAllTrafficData();
console.log('Alerts:', allData.alerts.length);
console.log('Cameras:', allData.cameras.length);
console.log('Events:', allData.events.length);
```

## Working with Alerts

```javascript
// Get all alerts
const alerts = await client.alerts.getAll();

// Get alerts for specific area
const johanAlerts = await client.alerts.getByArea('Johannesburg');

// Search alerts by keywords
const accidents = await client.alerts.searchByKeywords(['accident', 'collision']);

// Get alert statistics
const alertStats = await client.alerts.getStatistics();
console.log(`Total alerts: ${alertStats.total}`);
console.log(`Areas covered: ${alertStats.areasCount}`);
```

## Working with Cameras

```javascript
// Get all cameras
const cameras = await client.cameras.getAll();

// Get cameras on specific roadway
const n1Cameras = await client.cameras.getByRoadway('N1');

// Get only active cameras
const activeCameras = await client.cameras.getActive();

// Get cameras in geographic area
const bounds = {
  north: -25.5,
  south: -26.5,
  east: 28.5,
  west: 27.5
};
const camerasInArea = await client.cameras.getByBounds(bounds);

// Get camera statistics
const cameraStats = await client.cameras.getStatistics();
console.log(`Active cameras: ${cameraStats.active}`);
console.log(`Disabled cameras: ${cameraStats.disabled}`);
```

## Working with Events

```javascript
// Get all events
const events = await client.events.getAll();

// Get events by type
const accidents = await client.events.getByType('accidentsAndIncidents');
const roadwork = await client.events.getByType('roadwork');

// Get events by severity
const highSeverity = await client.events.getBySeverity('High');

// Get only active events
const activeEvents = await client.events.getActive();

// Get events on specific roadway
const n1Events = await client.events.getByRoadway('N1');

// Get event statistics
const eventStats = await client.events.getStatistics();
console.log(`Total events: ${eventStats.total}`);
console.log(`Active events: ${eventStats.active}`);
console.log(`Event types: ${eventStats.types.join(', ')}`);
```

## Working with Message Signs

```javascript
// Get all message signs
const signs = await client.messageSigns.getAll();

// Get signs with active messages
const activeSigns = await client.messageSigns.getWithMessages();

// Search sign messages
const roadworkSigns = await client.messageSigns.searchMessages('roadwork');

// Get signs by roadway
const n1Signs = await client.messageSigns.getByRoadway('N1');

// Get message sign statistics
const signStats = await client.messageSigns.getStatistics();
console.log(`Signs with messages: ${signStats.withMessages}`);
console.log(`Total messages: ${signStats.totalMessages}`);
```

## Working with Roadways

```javascript
// Get all roadways
const roadways = await client.roadways.getAll();

// Get roadways by type
const nationalRoads = await client.roadways.getByType('N');
const regionalRoads = await client.roadways.getByType('R');
const metroRoads = await client.roadways.getByType('M');

// Search roadways
const highways = await client.roadways.searchByName('highway');

// Get just roadway names
const roadwayNames = await client.roadways.getNamesOnly();

// Validate roadway
const isValid = await client.roadways.validateRoadway('N1');
console.log(`N1 is valid: ${isValid}`);

// Get roadway statistics
const roadwayStats = await client.roadways.getStatistics();
console.log(`National roads: ${roadwayStats.national}`);
console.log(`Regional roads: ${roadwayStats.regional}`);
```

## Advanced Operations

```javascript
// Get comprehensive traffic summary
const summary = await client.getTrafficSummary();
console.log('Traffic Summary:', summary);

// Search across all endpoints
const searchResults = await client.searchAll('N1');
console.log('N1 found in:');
console.log(`- ${searchResults.totals.cameras} cameras`);
console.log(`- ${searchResults.totals.events} events`);
console.log(`- ${searchResults.totals.messageSigns} message signs`);

// Get data in XML format
const alertsXml = await client.alerts.getAll('xml');
console.log('XML Response:', alertsXml);
```

## Error Handling

```javascript
import { ApiError, NetworkError, TimeoutError } from '../src/utils/errors.js';

try {
  const alerts = await client.alerts.getAll();
  console.log('Success:', alerts.length);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error ${error.statusCode}: ${error.message}`);
    if (error.isClientError()) {
      console.error('Client error - check your request');
    } else if (error.isServerError()) {
      console.error('Server error - try again later');
    }
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  } else if (error instanceof TimeoutError) {
    console.error('Request timed out:', error.message);
  } else {
    console.error('Unknown error:', error.message);
  }
}
```

## CLI Examples

```bash
# Get all alerts
npm run cli alerts list

# Get cameras on N1
npm run cli cameras roadway N1

# Get active events
npm run cli events active

# Search message signs
npm run cli signs search roadwork

# Get traffic summary
npm run cli all summary

# Search across all endpoints
npm run cli all search N1 --detailed

# Get data in XML format
npm run cli alerts list --xml

# Get statistics
npm run cli cameras stats
npm run cli events stats
```

## Web Interface

Start the web interface:

```bash
npm run serve
```

Then open http://localhost:8080 in your browser.

## Configuration Examples

### Environment Variables

```env
# .env file
I_TRAFFIC_API_KEY=your_actual_api_key_here
I_TRAFFIC_BASE_URL=https://www.i-traffic.co.za/api
I_TRAFFIC_DEFAULT_FORMAT=json
I_TRAFFIC_TIMEOUT=10000
I_TRAFFIC_DEBUG=false
```

### Programmatic Configuration

```javascript
import { ITrafficClient } from '../src/endpoints/index.js';

const client = new ITrafficClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://www.i-traffic.co.za/api',
  defaultFormat: 'json',
  timeout: 15000,
  debug: true
});
```

## Performance Tips

1. **Use parallel requests** for multiple endpoints:
```javascript
const [alerts, cameras] = await Promise.all([
  client.alerts.getAll(),
  client.cameras.getAll()
]);
```

2. **Use getAllTrafficData()** for bulk operations:
```javascript
const allData = await client.getAllTrafficData();
// More efficient than individual calls
```

3. **Filter data client-side** when possible:
```javascript
const cameras = await client.cameras.getAll();
const activeCameras = cameras.filter(c => !c.Disabled && !c.Blocked);
```

4. **Use appropriate timeouts** for your use case:
```javascript
const client = new ITrafficClient({
  apiKey: 'your-key',
  timeout: 30000 // 30 seconds for slow connections
});
```

## Integration Examples

### Express.js API

```javascript
import express from 'express';
import { ITrafficClient } from '../src/endpoints/index.js';

const app = express();
const client = new ITrafficClient({ apiKey: process.env.I_TRAFFIC_API_KEY });

app.get('/api/traffic/alerts', async (req, res) => {
  try {
    const alerts = await client.alerts.getAll();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

### React Component

```jsx
import React, { useState, useEffect } from 'react';
import { ITrafficClient } from '../src/endpoints/index.js';

function TrafficAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = new ITrafficClient({ 
      apiKey: process.env.REACT_APP_I_TRAFFIC_API_KEY 
    });
    
    client.alerts.getAll()
      .then(setAlerts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Traffic Alerts ({alerts.length})</h2>
      {alerts.map(alert => (
        <div key={alert.Id}>
          <h3>{alert.Message}</h3>
          <p>{alert.Notes}</p>
        </div>
      ))}
    </div>
  );
}
```
