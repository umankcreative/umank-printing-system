import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';


const api = axios.create({
  baseURL: 'https://373b-114-10-139-244.ngrok-free.app/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Skip ngrok browser warning
  },
  //withCredentials: true,  //Enable cookies to be sent with requests
  // timeout: 10000, // Set a timeout for requests
});

// Add interceptor to handle OPTIONS preflight


// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('🔴 API Request Error:', error);
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle network errors or server not responding
    if (!error.response) {
      console.error('🔴 API Error Response:', {
        status: error.status,
        data: error.message,
        url: error.config?.url,
        method: error.config?.method
      });
      return Promise.reject(new Error('Jaringan error - silahkan periksa koneksi Anda'));
    }

    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && originalRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      isRefreshing = true;

      // Check if we have a refresh token
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          // Try to refresh the token
          const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
            // refresh_token: refreshToken
          });
          
          const { access_token } = response.data;
          
          // Update the tokens in localStorage
          localStorage.setItem('token', access_token);
          // localStorage.setItem('refresh_token', refresh_token);
          
          // Update the Authorization header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }
          
          processQueue(null, access_token);
          isRefreshing = false;

          // Retry the original request
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;

          // If refresh token fails, clear all auth data and redirect
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available, clear auth data and redirect
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 