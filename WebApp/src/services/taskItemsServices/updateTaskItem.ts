import api from "../../api";
import type { TaskItem, TaskItemFormValues } from "../../interfaces/index";

export const updateTaskItem = async (
    id: number,
    values: TaskItemFormValues
): Promise<TaskItem> => {
    const response = await api.put(`/tasks/${id}`, {
        title: values.title,
        description: values.description,
        completed: values.completed
    });
    return response.data;
};
