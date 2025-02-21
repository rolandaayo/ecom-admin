import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  },
  // Add withCredentials for CORS
  withCredentials: true
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`, {
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('Request configuration error:', error);
    return Promise.reject(error);
  }
);

// Update response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      code: error.code,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });

    if (error.code === 'ERR_CONNECTION_REFUSED') {
      throw new Error('Cannot connect to server. Please ensure the server is running at http://localhost:5001');
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Server took too long to respond.');
    }
    if (!error.response) {
      throw new Error('Network error. Please check your connection and server status.');
    }
    throw error;
  }
);

export default api; 