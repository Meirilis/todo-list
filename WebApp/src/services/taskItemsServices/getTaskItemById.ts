import api from "../../api";
import type { TaskItem } from "../../interfaces/index";

export const getTaskItemById = async (id: number): Promise<TaskItem> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
};