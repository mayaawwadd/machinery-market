import axiosInstance from './axiosInstance';

export const loginUser = async (email, password) => {
  const response = await axiosInstance.post('/users/login', {
    email,
    password,
  });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axiosInstance.post('/users/register', userData);
  return response.data;
};
