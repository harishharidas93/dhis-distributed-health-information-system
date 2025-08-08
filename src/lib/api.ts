import axios from 'axios';

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',
  ENDPOINTS: {
    // Hedera NFT endpoints
    CREATE_COLLECTION: '/hedera/collection',
    GET_COLLECTIONS: '/hedera/collection',
    UPLOAD_METADATA: '/hedera/metadata',
    MINT_NFT: '/hedera/nft',
    SUBMIT_TRANSACTION: '/hedera/submit-transaction',
    UPLOAD_MEDICAL_RECORD: '/upload-medical-record',
    ACCESS_REQUESTS: '/access-requests',

    // User endpoints
    SIGNUP: '/user/signup',
    LOGIN: '/user/login',

    // Legacy endpoints (keep for fallback)
    GET_NFTS: '/hedera/nft',
    GET_NFT_BY_ID: '/hedera/nft',
  },
  TIMEOUT: 30000, // 30 seconds
};

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage or your preferred storage
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here
    if (error.response?.status === 401) {
      // Handle unauthorized - maybe redirect to login
      localStorage.removeItem('accessToken');
      window.location.href = '/';
    }
    
    // Log error for debugging
    console.error('API Error:', error.response?.data || error.message);
    
    return Promise.reject(error);
  }
);

export default apiClient;
