import { useCallback, useState } from 'react';
import type { TaskItem, TaskItemFormValues, TaskItemTable } from '../interfaces/index';
import {
    createTaskItem,
    deleteTaskItem,
    getTaskItemById,
    listTaskItems,
    searchTaskItems,
    updateTaskItem,
} from '../services/index';

export const useTaskItems = () => {
    const [taskItems, setTaskItems] = useState<TaskItemTable[]>([]);
    const [totalTaskItems, setTotalTaskItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTaskItems = useCallback(
        async (currentPage = 1, currentPageSize = 10) => {
            try {
                setLoading(true);
                setError(null);

                const result = await listTaskItems(currentPage, currentPageSize);

                setTaskItems(result.data);
                setTotalTaskItems(result.totalItems);
                setTotalPages(result.totalPages);
                setPage(currentPage);
                setPageSize(currentPageSize);
            } catch (err) {
                setError('Erro ao carregar tarefas');
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const search = useCallback(
        async (key: string, currentPage = 1, currentPageSize = 10) => {
            try {
                setLoading(true);
                setError(null);

                const trimmedKey = key.trim();
                if (!trimmedKey) {
                    await fetchTaskItems(currentPage, currentPageSize);
                    return;
                }

                const result = await searchTaskItems(trimmedKey, currentPage, currentPageSize);

                setTaskItems(result.data);
                setTotalTaskItems(result.totalItems);
                setTotalPages(result.totalPages);
                setPage(currentPage);
                setPageSize(currentPageSize);
            } catch (err) {
                setError('Erro ao buscar tarefas');
            } finally {
                setLoading(false);
            }
        },
        [fetchTaskItems]
    );

    const fetchTaskItemById = useCallback(async (id: number): Promise<TaskItem> => {
        return await getTaskItemById(id);
    }, []);

    const create = useCallback(async (values: TaskItemFormValues) => {
        return await createTaskItem(values);
    }, []);

    const update = useCallback(async (id: number, values: TaskItemFormValues) => {
        return await updateTaskItem(id, values);
    }, []);

    const remove = useCallback(async (id: number) => {
        await deleteTaskItem(id);
    }, []);

    return {
        taskItems,
        totalTaskItems,
        totalPages,
        page,
        pageSize,
        loading,
        error,
        fetchTaskItems,
        fetchTaskItemById,
        searchTaskItems: search,
        createTaskItem: create,
        updateTaskItem: update,
        deleteTaskItem: remove,
    };
};
