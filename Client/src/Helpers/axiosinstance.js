import axios from "axios";

const BASE_URL = "https://lms-backend-om5b.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default axiosInstance;
