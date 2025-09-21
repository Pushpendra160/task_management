import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/auth';

export const login = async (username: string, password: string) => {
  const res = await axios.post(`${API_URL}/login`, { username, password });
  return res.data;
};

export const register = async (username: string, password: string, role: string) => {
  const res = await axios.post(`${API_URL}/register`, { username, password, role });
  return res.data;
};
