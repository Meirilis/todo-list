import api from "../../api";
import type { TaskItemOptions } from "../../interfaces/index";

export const listTaskItemsForSelect = async (): Promise<TaskItemOptions[]> => {
    const response = await api.get(`/tasks/options`);
    return response.data;
};