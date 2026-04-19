import axios from "axios";

const API_URL = "http://localhost:5002/api/reports";

export const createReport = async (reportData, token) => {
  const response = await axios.post(API_URL, reportData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getMyReports = async (token) => {
  const response = await axios.get(`${API_URL}/my-reports`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getAllReports = async (token) => {
  const response = await axios.get("http://localhost:5002/api/reports", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateReportStatus = async (id, status, token) => {
  const response = await axios.put(
    `http://localhost:5002/api/reports/${id}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const updateMyReport = async (id, reportData, token) => {
  const response = await axios.put(`${API_URL}/my-reports/${id}`, reportData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteMyReport = async (id, token) => {
  const response = await axios.delete(`${API_URL}/my-reports/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteAnyReport = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};