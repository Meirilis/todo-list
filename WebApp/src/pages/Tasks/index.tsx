import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { PageTitle } from '../../components';
import { TaskItemForm } from '../../components/TaskItemForm';
import { TaskItemsTable } from '../../components/TaskItemsTable';
import { usePermissions } from '../../hooks';
import { useTaskItems } from '../../hooks/useTaskItems';
import type {
    TaskItem,
    TaskItemFormValues,
    TaskItemTable,
} from '../../interfaces/index';

export const Tasks = () => {
    const {
        taskItems,
        totalTaskItems,
        page,
        pageSize,
        loading,
        error,
        fetchTaskItems,
        fetchTaskItemById,
        createTaskItem,
        updateTaskItem,
        deleteTaskItem,
        searchTaskItems,
    } = useTaskItems();

    const { permissionsMap } = usePermissions();

    const [searchKey, setSearchKey] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTaskItem, setSelectedTaskItem] = useState<TaskItem | null>(null);

    useEffect(() => {
        fetchTaskItems(1, 10);
    }, [fetchTaskItems]);

    const reload = async () => {
        if (searchKey.trim()) {
            await searchTaskItems(searchKey, page, pageSize);
            return;
        }
        await fetchTaskItems(page, pageSize);
    };

    const handleSearch = async (value: string) => {
        setSearchKey(value);
        await searchTaskItems(value, 1, pageSize);
    };

    const handleOpenCreate = () => {
        setSelectedTaskItem(null);
        setModalOpen(true);
    };

    const handleOpenEdit = async (taskItem: TaskItemTable) => {
        const detailedTaskItem = await fetchTaskItemById(taskItem.id);
        setSelectedTaskItem(detailedTaskItem);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedTaskItem(null);
        setModalOpen(false);
    };

    const handleSubmit = async (values: TaskItemFormValues) => {
        if (selectedTaskItem) {
            await updateTaskItem(selectedTaskItem.id, values);
        } else {
            await createTaskItem(values);
        }

        handleCloseModal();
        await reload();
    };

    const handleDelete = async (taskItem: TaskItemTable) => {
        const confirmed = window.confirm(
            'Deseja excluir a tarefa "' + taskItem.title + '"?'
        );

        if (!confirmed) {
            return;
        }

        await deleteTaskItem(taskItem.id);
        await reload();
    };

    const handlePageChange = async (newPage: number) => {
        if (searchKey.trim()) {
            await searchTaskItems(searchKey, newPage, pageSize);
            return;
        }
        await fetchTaskItems(newPage, pageSize);
    };

    const handlePageSizeChange = async (newPageSize: number) => {
        if (searchKey.trim()) {
            await searchTaskItems(searchKey, 1, newPageSize);
            return;
        }
        await fetchTaskItems(1, newPageSize);
    };

    const handleToggleCompleted = async (taskItem: TaskItemTable) => {
        await updateTaskItem(taskItem.id, {
            title: taskItem.title,
            description: taskItem.description,
            completed: !taskItem.completed,
        });

        await reload();
    };

    return (
        <Container
            sx={{
                mt: 4,
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center',
            }}
        >
            <PageTitle
                icon={permissionsMap.TASKS}
                title="Tarefas"
            />

            <Box width="100%" display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" color="primary" onClick={handleOpenCreate}>
                    Nova Tarefa
                </Button>
            </Box>

            <Box width="100%" mb={3}>
                <TextField
                    label="Buscar tarefas"
                    value={searchKey}
                    onChange={(event) => handleSearch(event.target.value)}
                    fullWidth
                />
            </Box>

            {error && (
                <Box width="100%" mt={2}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            )}

            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box width="100%">
                    <TaskItemsTable
                        taskItems={taskItems}
                        totalTaskItems={totalTaskItems}
                        page={page}
                        pageSize={pageSize}
                        loading={loading}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        onEdit={handleOpenEdit}
                        onDelete={handleDelete}
                        onToggleCompleted={handleToggleCompleted}
                    />
                </Box>
            )}

            <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedTaskItem ? 'Editar Tarefa' : 'Nova Tarefa'}
                </DialogTitle>

                <DialogContent>
                    <TaskItemForm
                        taskItem={selectedTaskItem}
                        onSubmit={handleSubmit}
                        onCancel={handleCloseModal}
                    />
                </DialogContent>
            </Dialog>
        </Container>
    );
};