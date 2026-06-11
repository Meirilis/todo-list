import api from "../../api";
import type { TaskItem, TaskItemFormValues } from "../../interfaces/index";

export const createTaskItem = async (
    values: TaskItemFormValues
): Promise<TaskItem> => {
    const response = await api.post(`/tasks`, {
        title: values.title,
        description: values.description
    });
    return response.data;
};
