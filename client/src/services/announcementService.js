import axios from "axios";

const API_URL = "http://localhost:5002/api/announcements";

export const getAnnouncements = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createAnnouncement = async (announcementData, token) => {
  const response = await axios.post(API_URL, announcementData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateAnnouncement = async (id, announcementData, token) => {
  const response = await axios.put(`${API_URL}/${id}`, announcementData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteAnnouncement = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};