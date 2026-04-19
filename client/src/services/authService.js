import axios from "axios";

const API_URL = "http://localhost:5002/api/auth";

export const signup = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

export const getMe = async (token) => {
  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const updateMe = async (userData, token) => {
  const response = await axios.put(`${API_URL}/me`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};