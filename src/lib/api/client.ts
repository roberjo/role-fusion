import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { getStoredAccessToken, refreshAccessToken } from '@/lib/auth';

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = getStoredAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config;
      
      // Handle 401 Unauthorized errors
      if (error.response?.status === 401 && originalRequest) {
        // Use a type assertion to add the _retry property
        const typedRequest = originalRequest as AxiosRequestConfig & { _retry?: boolean };
        
        if (!typedRequest._retry) {
          typedRequest._retry = true;
          try {
            await refreshAccessToken();
            const token = getStoredAccessToken();
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return client(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
      }

      // Transform error to consistent format
      const apiError: ApiError = {
        message: error.response?.data ? (error.response.data as any).message || 'An unexpected error occurred' : 'An unexpected error occurred',
        code: error.response?.data ? (error.response.data as any).code || 'UNKNOWN_ERROR' : 'UNKNOWN_ERROR',
        status: error.response?.status || 500,
      };

      return Promise.reject(apiError);
    }
  );

  return client;
};

export const apiClient = createApiClient();

// Type-safe API request wrapper
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    apiClient.get<T>(url, config).then(response => response.data),
  
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
    apiClient.post<T>(url, data, config).then(response => response.data),
  
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
    apiClient.put<T>(url, data, config).then(response => response.data),
  
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    apiClient.delete<T>(url, config).then(response => response.data),
  
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
    apiClient.patch<T>(url, data, config).then(response => response.data),
}; 