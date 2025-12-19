/**
 * Backend Configuration
 * Switch between Java Spring Boot and Node.js backends
 */

// Detect which backend to use based on port
const BACKEND_TYPE = window.location.port === '8080' ? 'java' : 'nodejs';

// Backend configurations
const BACKENDS = {
    java: {
        baseURL: '/api', // Relative URL when served from Java backend
        name: 'Java Spring Boot',
        port: 8080
    },
    nodejs: {
        baseURL: '/api', // Relative URL when served from Node.js backend
        name: 'Node.js Express',
        port: 3000
    }
};

// Get current backend config
const getCurrentBackend = () => BACKENDS[BACKEND_TYPE] || BACKENDS.nodejs;

// API base URL
const API_BASE = getCurrentBackend().baseURL;

// Switch backend
const switchBackend = (type) => {
    if (BACKENDS[type]) {
        localStorage.setItem('backend_type', type);
        location.reload();
    }
};

// Export for use
if (typeof window !== 'undefined') {
    window.BACKEND_CONFIG = {
        type: BACKEND_TYPE,
        current: getCurrentBackend(),
        API_BASE,
        switch: switchBackend,
        backends: BACKENDS
    };
}

console.log(`🔌 Backend: ${getCurrentBackend().name} (${getCurrentBackend().baseURL})`);
