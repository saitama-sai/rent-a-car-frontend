import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosError } from 'axios';

// Varsayılan backend URL, deploy olduğunda değişebilir
const RENDER_API_URL = 'https://rent-a-car-backend-6pfm.onrender.com/api';
const LOCAL_API_URL = 'http://localhost:3000/api';

export const API_URL = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? LOCAL_API_URL
    : RENDER_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: Token varsa header'a ekle
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

export default api;
