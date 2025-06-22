import axios from 'axios';

const API_BASE_URL = 'https://watchify-backend-1.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 10 second timeout
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('watchify_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email: string, password: string) => {
    console.log('Attempting login for:', email);
    return api.post('/auth/login', { email, password });
  },
  
  register: (email: string, password: string, username: string) => {
    console.log('Attempting registration for:', email, username);
    return api.post('/auth/register', { email, password, username });
  },
  
  loginAnonymous: (username: string) => {
    console.log('Attempting anonymous login for:', username);
    return api.post('/auth/anonymous-login', { username });
  },
};

export const roomService = {
  createRoom: (videoUrl: string, title?: string) =>
    api.post('/rooms/create', { videoUrl, title }),
  
  joinRoom: (roomId: string) =>
    api.post('/rooms/join', { roomId }),
  
  getRoomUsers: (roomId: string) =>
    api.get(`/rooms/${roomId}`),
};

export default api;