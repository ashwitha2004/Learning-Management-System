import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://lms-backend-om5b.onrender.com/api/v1",
  withCredentials: true,
});

export default axiosInstance;
