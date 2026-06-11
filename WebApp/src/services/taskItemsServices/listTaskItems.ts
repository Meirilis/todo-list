import api from '../../api';
import type { TaskItemPagination } from '../../interfaces/index';

export const listTaskItems = async (
    page = 1,
    pageSize = 10
): Promise<TaskItemPagination> => {
    const response = await api.get(`/tasks`, {
        params: {
            page,
            pageSize
        }
    });

    return response.data;
};