import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const register = async (email: string, password: string) => {
    await axios.post(`${API_URL}/register`, { email, password });
};

export const login = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem('token', response.data.token);
};

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};
