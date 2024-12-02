import axios, { AxiosInstance } from 'axios';
import encryptDecrypt from '../function/encryptDecrypt';
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

const token =
  encryptDecrypt.decrypt(localStorage.getItem('accessTokenProject') as string) ||
  encryptDecrypt.decrypt(sessionStorage.getItem('accessTokenProject') as string);
console.log('🚀 ~ token:', token);

axiosInstance.interceptors.request.use(async (config: any) => {
  const token = sessionStorage.getItem('accessToken');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default axiosInstance;
