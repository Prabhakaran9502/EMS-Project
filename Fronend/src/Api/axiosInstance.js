import axios from "axios";
import { store } from "../store/store";

const axiosInstance = axios.create({
    baseURL: "https://localhost:44333/api", // 🔁 change to your backend URL
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

/* =======================
   Request Interceptor
======================= */
axiosInstance.interceptors.request.use(
    (config) => {
        const publicUrls = [
            "/users/login",
            "/users/forgot-password",
            "/users/check-email"
        ];

        const isPublic = publicUrls.some(url =>
            config.url.includes(url)
        );

        if (!isPublic) {
            const token = store.getState().auth.token;

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);



/* =======================
   Response Interceptor
======================= */
axiosInstance.interceptors.response.use(
    (response) => response, (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                store.dispatch(logout());
                window.location.href = "/login";
            }
        }
        else if (error.code === "ECONNABORTED") {
            console.error("Request timeout");
        }
        return Promise.reject(error);
    });

export default axiosInstance;
