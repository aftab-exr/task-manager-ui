import { apiClient } from "./apiClient";

const authService = {
    register: (data) => apiClient.post("/users/register",data),
    login: (data) => apiClient.post("/users/login",data),
    logout: () => localStorage.removeItem("token")
}

export { authService };