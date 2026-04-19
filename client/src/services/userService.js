import axios from "axios";

const API_URL = "http://localhost:5002/api/users";

export const getAllUsers = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateUserRole = async (id, role, token) => {
  const response = await axios.put(
    `${API_URL}/${id}/role`,
    { role },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const updateUserStatus = async (id, status, token) => {
  const response = await axios.put(
    `${API_URL}/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};