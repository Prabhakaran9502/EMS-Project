import axios from "axios";

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
        const token = localStorage.getItem("token"); // or sessionStorage

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/* =======================
   Response Interceptor
======================= */
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Global error handling
        if (error.response) {
            if (error.response.status === 401) {
                console.error("Unauthorized – redirect to login");
                // optional: window.location.href = "/login";
            }
        } else if (error.code === "ECONNABORTED") {
            console.error("Request timeout");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
