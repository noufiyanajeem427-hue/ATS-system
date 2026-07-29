import axios from "axios";

const API = "http://localhost:5000/api/interviews";

export const getInterviews = () => axios.get(API);

export const getInterview = (id) =>
  axios.get(`${API}/${id}`);

export const createInterview = (data) =>
  axios.post(API, data);

export const updateInterview = (id, data) =>
  axios.put(`${API}/${id}`, data);

export const deleteInterview = (id) =>
  axios.delete(`${API}/${id}`);

export const updateStatus = (id, status) =>
  axios.patch(`${API}/${id}/status`, { status });

export const addFeedback = (id, feedback, rating) =>
  axios.patch(`${API}/${id}/feedback`, {
    feedback,
    rating,
  });