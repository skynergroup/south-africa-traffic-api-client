import { environment } from '../../config/environment.js';
import { ITrafficClient } from '../endpoints/index.js';

/**
 * Demo script showing how to use all i-traffic API functions
 */
async function runDemo() {
  console.log('🚦 i-traffic API Client Demo\n');

  // Initialize the client
  const client = new ITrafficClient(environment.getClientConfig());

  try {
    console.log('📋 Testing individual API endpoints...\n');

    // Test each endpoint individually
    console.log('1. 🚨 Fetching Traffic Alerts...');
    const alerts = await client.alerts.getAll();
    console.log(`   Found ${Array.isArray(alerts) ? alerts.length : 'N/A'} alerts`);
    if (Array.isArray(alerts) && alerts.length > 0) {
      console.log(`   Sample alert: ${alerts[0].Message || 'No message'}`);
    }
    console.log();

    console.log('2. 📹 Fetching Traffic Cameras...');
    const cameras = await client.cameras.getAll();
    console.log(`   Found ${Array.isArray(cameras) ? cameras.length : 'N/A'} cameras`);
    if (Array.isArray(cameras) && cameras.length > 0) {
      console.log(`   Sample camera: ${cameras[0].Name || 'No name'} on ${cameras[0].RoadwayName || 'Unknown road'}`);
    }
    console.log();

    console.log('3. 🚧 Fetching Traffic Events...');
    const events = await client.events.getAll();
    console.log(`   Found ${Array.isArray(events) ? events.length : 'N/A'} events`);
    if (Array.isArray(events) && events.length > 0) {
      console.log(`   Sample event: ${events[0].Description || 'No description'}`);
    }
    console.log();

    console.log('4. 📢 Fetching Message Signs...');
    const messageSigns = await client.messageSigns.getAll();
    console.log(`   Found ${Array.isArray(messageSigns) ? messageSigns.length : 'N/A'} message signs`);
    if (Array.isArray(messageSigns) && messageSigns.length > 0) {
      console.log(`   Sample sign: ${messageSigns[0].Name || 'No name'}`);
    }
    console.log();

    console.log('5. 🛣️  Fetching Roadways...');
    const roadways = await client.roadways.getAll();
    console.log(`   Found ${Array.isArray(roadways) ? roadways.length : 'N/A'} roadways`);
    if (Array.isArray(roadways) && roadways.length > 0) {
      console.log(`   Sample roadway: ${roadways[0].RoadwayName || 'No name'}`);
    }
    console.log();

    console.log('📊 Testing bulk data fetch...\n');
    console.log('6. 🔄 Fetching All Traffic Data...');
    const allData = await client.getAllTrafficData();
    console.log('   ✅ Successfully fetched all traffic data');
    console.log(`   📊 Summary:`);
    console.log(`      - Alerts: ${Array.isArray(allData.alerts) ? allData.alerts.length : 'N/A'}`);
    console.log(`      - Cameras: ${Array.isArray(allData.cameras) ? allData.cameras.length : 'N/A'}`);
    console.log(`      - Events: ${Array.isArray(allData.events) ? allData.events.length : 'N/A'}`);
    console.log(`      - Message Signs: ${Array.isArray(allData.messageSigns) ? allData.messageSigns.length : 'N/A'}`);
    console.log(`      - Roadways: ${Array.isArray(allData.roadways) ? allData.roadways.length : 'N/A'}`);
    console.log(`      - Timestamp: ${allData.timestamp}`);
    console.log();

    console.log('🎯 Testing XML format...\n');
    console.log('7. 📄 Fetching Alerts in XML format...');
    const alertsXml = await client.alerts.getAll('xml');
    console.log(`   XML response length: ${typeof alertsXml === 'string' ? alertsXml.length : 'N/A'} characters`);
    console.log();

    console.log('✅ Demo completed successfully!');
    console.log('\n🔧 To use this client in your own project:');
    console.log('   1. Copy .env.example to .env');
    console.log('   2. Add your i-traffic API key to .env');
    console.log('   3. Import and use ITrafficClient in your code');

  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure you have a valid API key in your .env file');
    console.log('   2. Check your internet connection');
    console.log('   3. Verify the API is accessible from your location');
    process.exit(1);
  }
}

// Run the demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runDemo();
}
