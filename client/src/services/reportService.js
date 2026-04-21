import axios from "axios";

const API_URL = "http://localhost:5002/api/reports";

export const createWasteReport = async (reportData, token) => {
  const response = await axios.post(`${API_URL}/waste`, reportData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getMyReports = async (token) => {
  const response = await axios.get(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateMyReport = async (id, reportData, token) => {
  const response = await axios.put(`${API_URL}/my/${id}`, reportData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteMyReport = async (id, token) => {
  const response = await axios.delete(`${API_URL}/my/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getWasteReports = async (token) => {
  const response = await axios.get(`${API_URL}/waste`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateReportStatus = async (id, status, token) => {
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

export const deleteAnyReport = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


export const reportUser = async (reportData, token) => {
  const response = await axios.post(`${API_URL}/user`, reportData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


export const getUserReports = async (token) => {
  const response = await axios.get(`${API_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};