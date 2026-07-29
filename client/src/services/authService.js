import api from "./api";

// Register
export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// Login
export const login = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

//forgot
export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

//rest
export const resetPassword = async (token, password) => {
  const response = await api.post(
    `/auth/reset-password/${token}`,
    { password }
  );

  return response.data;
};