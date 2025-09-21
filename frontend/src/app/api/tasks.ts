
import axios from 'axios';

// Add a request interceptor to include token from localStorage
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/tasks';

export const fetchTasks = async ( page = 1, limit = 10) => {
  const res = await axios.get(`${API_URL}?page=${page}&limit=${limit}`);
  return res.data;
};

export const createTask = async (token: string, task: any) => {
  const res = await axios.post(API_URL, task);
  return res.data;
};
export const fetchTaskById = async (id: string) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};
export const updateTask = async (token: string, id: string, updates: any) => {
  const res = await axios.put(`${API_URL}/${id}`, updates);
  return res.data;
};

export const deleteTask = async (token: string, id: string) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};

export const updateTaskStatus = async (token: string, id: string, status: string) => {
  const res = await axios.patch(`${API_URL}/${id}/status`, { status });
  return res.data;
};

export const updateTaskPriority = async (token: string, id: string, priority: string) => {
  const res = await axios.patch(`${API_URL}/${id}/priority`, { priority });
  return res.data;
};
