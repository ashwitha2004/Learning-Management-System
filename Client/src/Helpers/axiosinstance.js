import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://lms-server-vd61.onrender.com/api/v1";

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL=BASE_URL;
axiosInstance.defaults.withCredentials=true;

/**
 * A 401 only ever means "your token cookie is missing/invalid/expired" (see
 * isLoggedIn middleware server-side) — it's distinct from the 400s used for
 * normal login-failure toasts. We only react to it when the app previously
 * believed the user was logged in; an anonymous visitor's routine session
 * check on page load also gets a 401 and that's not an error worth acting on.
 */
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const isSessionExpired =
            error?.response?.status === 401 &&
            localStorage.getItem("isLoggedIn") === "true";

        if (isSessionExpired) {
            localStorage.clear();
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;