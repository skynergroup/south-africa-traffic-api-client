// Import the browser-compatible client
import { ITrafficWebClient } from '../client.js';

// Global client instance
let client = null;

// UI Helper functions
function showLoading() {
    const results = document.getElementById('results');
    results.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Fetching data from i-traffic API...</p>
        </div>
    `;
}

function showError(message, details = '') {
    const results = document.getElementById('results');
    results.innerHTML = `
        <div class="result-item error">
            <div class="result-title">❌ Error</div>
            <div class="result-content">${message}${details ? '\n\nDetails:\n' + details : ''}</div>
        </div>
    `;
}

function showSuccess(title, data) {
    const results = document.getElementById('results');
    const formattedData = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    const dataLength = Array.isArray(data) ? data.length : (typeof data === 'string' ? data.length : 'N/A');
    
    results.innerHTML = `
        <div class="result-item success">
            <div class="result-title">✅ ${title}</div>
            <p style="margin-bottom: 15px;">
                <strong>Data Length:</strong> ${dataLength} ${Array.isArray(data) ? 'items' : 'characters'}
            </p>
            <div class="result-content">${formattedData}</div>
        </div>
    `;
}

function showSummary(title, summary) {
    const results = document.getElementById('results');
    
    let summaryHtml = `
        <div class="result-item success">
            <div class="result-title">📊 ${title}</div>
            <div class="result-summary">
                <div class="summary-grid">
    `;
    
    if (summary.totals) {
        Object.entries(summary.totals).forEach(([key, value]) => {
            summaryHtml += `
                <div class="summary-item">
                    <div class="summary-number">${value}</div>
                    <div class="summary-label">${key.charAt(0).toUpperCase() + key.slice(1)}</div>
                </div>
            `;
        });
    } else {
        // Handle individual statistics
        const stats = ['total', 'active', 'alerts', 'cameras', 'events'];
        stats.forEach(stat => {
            if (summary[stat] !== undefined) {
                summaryHtml += `
                    <div class="summary-item">
                        <div class="summary-number">${summary[stat]}</div>
                        <div class="summary-label">${stat.charAt(0).toUpperCase() + stat.slice(1)}</div>
                    </div>
                `;
            }
        });
    }
    
    summaryHtml += `
                </div>
                <div style="margin-top: 20px;">
                    <strong>Generated:</strong> ${summary.timestamp || new Date().toISOString()}
                </div>
            </div>
            <div class="result-content">${JSON.stringify(summary, null, 2)}</div>
        </div>
    `;
    
    results.innerHTML = summaryHtml;
}

function getClient() {
    const apiKey = document.getElementById('apiKey').value.trim();
    const format = document.getElementById('format').value;
    const timeout = parseInt(document.getElementById('timeout').value);

    if (!apiKey) {
        throw new Error('Please enter your API key');
    }

    return new ITrafficWebClient({
        apiKey,
        defaultFormat: format,
        timeout
    });
}

function disableButtons(disabled = true) {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => btn.disabled = disabled);
}

// Basic API Functions
async function fetchAlerts() {
    try {
        showLoading();
        disableButtons(true);
        
        const client = getClient();
        const format = document.getElementById('format').value;
        const data = await client.getAlerts(format);
        
        showSuccess('Traffic Alerts', data);
    } catch (error) {
        showError('Failed to fetch alerts', error.message);
    } finally {
        disableButtons(false);
    }
}

async function fetchCameras() {
    try {
        showLoading();
        disableButtons(true);
        
        const client = getClient();
        const format = document.getElementById('format').value;
        const data = await client.getCameras(format);
        
        showSuccess('Traffic Cameras', data);
    } catch (error) {
        showError('Failed to fetch cameras', error.message);
    } finally {
        disableButtons(false);
    }
}

async function fetchEvents() {
    try {
        showLoading();
        disableButtons(true);
        
        const client = getClient();
        const format = document.getElementById('format').value;
        const data = await client.getEvents(format);
        
        showSuccess('Traffic Events', data);
    } catch (error) {
        showError('Failed to fetch events', error.message);
    } finally {
        disableButtons(false);
    }
}

async function fetchMessageSigns() {
    try {
        showLoading();
        disableButtons(true);
        
        const client = getClient();
        const format = document.getElementById('format').value;
        const data = await client.getMessageSigns(format);
        
        showSuccess('Message Signs', data);
    } catch (error) {
        showError('Failed to fetch message signs', error.message);
    } finally {
        disableButtons(false);
    }
}

async function fetchRoadways() {
    try {
        showLoading();
        disableButtons(true);
        
        const client = getClient();
        const format = document.getElementById('format').value;
        const data = await client.getRoadways(format);
        
        showSuccess('Roadways', data);
    } catch (error) {
        showError('Failed to fetch roadways', error.message);
    } finally {
        disableButtons(false);
    }
}

async function fetchAllData() {
    try {
        showLoading();
        disableButtons(true);
        
        const client = getClient();
        const format = document.getElementById('format').value;
        const data = await client.getAllTrafficData(format);
        
        showSuccess('All Traffic Data', data);
    } catch (error) {
        showError('Failed to fetch all data', error.message);
    } finally {
        disableButtons(false);
    }
}

// Advanced Functions
async function getTrafficSummary() {
    try {
        showLoading();
        disableButtons(true);
        
        const client = getClient();
        const allData = await client.getAllTrafficData('json');
        
        // Generate summary from all data
        const summary = {
            timestamp: allData.timestamp,
            totals: {
                alerts: Array.isArray(allData.alerts) ? allData.alerts.length : 0,
                cameras: Array.isArray(allData.cameras) ? allData.cameras.length : 0,
                events: Array.isArray(allData.events) ? allData.events.length : 0,
                messageSigns: Array.isArray(allData.messageSigns) ? allData.messageSigns.length : 0,
                roadways: Array.isArray(allData.roadways) ? allData.roadways.length : 0
            }
        };
        
        showSummary('Traffic Summary', summary);
    } catch (error) {
        showError('Failed to generate traffic summary', error.message);
    } finally {
        disableButtons(false);
    }
}

async function getActiveCameras() {
    try {
        showLoading();
        disableButtons(true);
        
        const client = getClient();
        const cameras = await client.getCameras('json');
        
        if (Array.isArray(cameras)) {
            const activeCameras = cameras.filter(camera => !camera.Disabled && !camera.Blocked);
            showSuccess('Active Cameras', activeCameras);
        } else {
            showSuccess('Active Cameras', cameras);
        }
    } catch (error) {
        showError('Failed to fetch active cameras', error.message);
    } finally {
        disableButtons(false);
    }
}

async function getActiveEvents() {
    try {
        showLoading();
        disableButtons(true);
        
        const client = getClient();
        const events = await client.getEvents('json');
        
        if (Array.isArray(events)) {
            const now = new Date();
            const activeEvents = events.filter(event => {
                if (!event.PlannedEndDate) return true;
                try {
                    const [datePart, timePart] = event.PlannedEndDate.split(' ');
                    const [day, month, year] = datePart.split('/');
                    const endDate = new Date(`${year}-${month}-${day}T${timePart}`);
                    return endDate > now;
                } catch {
                    return true;
                }
            });
            showSuccess('Active Events', activeEvents);
        } else {
            showSuccess('Active Events', events);
        }
    } catch (error) {
        showError('Failed to fetch active events', error.message);
    } finally {
        disableButtons(false);
    }
}

async function performSearch() {
    const searchTerm = document.getElementById('searchTerm').value.trim();
    if (!searchTerm) {
        showError('Please enter a search term');
        return;
    }
    
    try {
        showLoading();
        disableButtons(true);
        
        const client = getClient();
        const allData = await client.getAllTrafficData('json');
        
        // Simple search across all data
        const results = {
            searchTerm,
            timestamp: new Date().toISOString(),
            alerts: [],
            cameras: [],
            events: [],
            messageSigns: [],
            roadways: []
        };
        
        const searchLower = searchTerm.toLowerCase();
        
        // Search alerts
        if (Array.isArray(allData.alerts)) {
            results.alerts = allData.alerts.filter(alert => 
                (alert.Message && alert.Message.toLowerCase().includes(searchLower)) ||
                (alert.Notes && alert.Notes.toLowerCase().includes(searchLower)) ||
                (alert.AreaNames && alert.AreaNames.some(area => area.toLowerCase().includes(searchLower)))
            );
        }
        
        // Search cameras
        if (Array.isArray(allData.cameras)) {
            results.cameras = allData.cameras.filter(camera =>
                (camera.Name && camera.Name.toLowerCase().includes(searchLower)) ||
                (camera.RoadwayName && camera.RoadwayName.toLowerCase().includes(searchLower))
            );
        }
        
        // Search events
        if (Array.isArray(allData.events)) {
            results.events = allData.events.filter(event =>
                (event.Description && event.Description.toLowerCase().includes(searchLower)) ||
                (event.RoadwayName && event.RoadwayName.toLowerCase().includes(searchLower)) ||
                (event.Location && event.Location.toLowerCase().includes(searchLower))
            );
        }
        
        // Search message signs
        if (Array.isArray(allData.messageSigns)) {
            results.messageSigns = allData.messageSigns.filter(sign =>
                (sign.Name && sign.Name.toLowerCase().includes(searchLower)) ||
                (sign.Roadway && sign.Roadway.toLowerCase().includes(searchLower)) ||
                (sign.Messages && sign.Messages.some(msg => msg.toLowerCase().includes(searchLower)))
            );
        }
        
        // Search roadways
        if (Array.isArray(allData.roadways)) {
            results.roadways = allData.roadways.filter(roadway =>
                roadway.RoadwayName && roadway.RoadwayName.toLowerCase().includes(searchLower)
            );
        }
        
        results.totals = {
            alerts: results.alerts.length,
            cameras: results.cameras.length,
            events: results.events.length,
            messageSigns: results.messageSigns.length,
            roadways: results.roadways.length
        };
        
        showSuccess(`Search Results for "${searchTerm}"`, results);
    } catch (error) {
        showError('Search failed', error.message);
    } finally {
        disableButtons(false);
    }
}

// Alias for backward compatibility
window.searchAll = performSearch;

// Make functions globally available
window.fetchAlerts = fetchAlerts;
window.fetchCameras = fetchCameras;
window.fetchEvents = fetchEvents;
window.fetchMessageSigns = fetchMessageSigns;
window.fetchRoadways = fetchRoadways;
window.fetchAllData = fetchAllData;
window.getTrafficSummary = getTrafficSummary;
window.getActiveCameras = getActiveCameras;
window.getActiveEvents = getActiveEvents;
window.performSearch = performSearch;
