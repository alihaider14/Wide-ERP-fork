import axios from 'axios';
import { redirect } from 'react-router-dom';

const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api'
    : import.meta.env.VITE_BASE_API_URL;

export const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');

    if (token && token !== 'null' && token.trim() !== '') {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      redirect('/login');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
