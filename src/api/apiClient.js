import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://task-manager-api-dkke.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
    },
})

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error.response?.data?.message || error)
)

export { apiClient };