import api from "../../api";
import type { TaskItemPagination } from "../../interfaces/index";

export const searchTaskItems = async (
    key: string,
    page = 1,
    pageSize = 10
): Promise<TaskItemPagination> => {
    const response = await api.get(`/tasks/search`, {
        params: {
            key,
            page,
            pageSize
        }
    });

    return response.data;
};