import api from "../../api";

export const deleteTaskItem = async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
}