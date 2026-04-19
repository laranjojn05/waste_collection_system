import axios from "axios";

const API_URL = "http://localhost:5002/api/schedules";

export const getSchedules = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createSchedule = async (scheduleData, token) => {
  const response = await axios.post(API_URL, scheduleData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateSchedule = async (id, scheduleData, token) => {
  const response = await axios.put(`${API_URL}/${id}`, scheduleData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteSchedule = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};