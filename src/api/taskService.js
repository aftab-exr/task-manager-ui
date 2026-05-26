import { apiClient } from "./apiClient";

const taskService = {
    create: (data) => apiClient.post("/tasks/create", data),
    myTasks: () => apiClient.get("/tasks/mytasks"),
    update: (id, data) => apiClient.put(`/tasks/${id}/update`, data),
    delete: (id) => apiClient.delete(`/tasks/${id}/delete`),
    breakdown:(data) => apiClient.post("/tasks/breakdown",data)
}

export { taskService };