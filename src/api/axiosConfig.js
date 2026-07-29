
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  timeout: 30000,
});

// Request interceptor - Add timestamp to prevent caching
axiosInstance.interceptors.request.use(
  (config) => {
    // Add random query param to bust cache
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('❌ API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
