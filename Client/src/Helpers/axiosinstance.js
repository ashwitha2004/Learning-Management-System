import axios from "axios";
 baseURL: "https://lms-backend-om5b.onrender.com/api";


const axiosInstance = axios.create();

axiosInstance.defaults.baseURL=BASE_URL;
axiosInstance.defaults.withCredentials=true;

export default axiosInstance;