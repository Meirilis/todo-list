import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Box,
    Checkbox,
    Chip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import type { TaskItemTable } from '../../interfaces/index';

interface TaskItemsTableProps {
    taskItems: TaskItemTable[];
    totalTaskItems: number;
    page: number;
    pageSize: number;
    loading: boolean;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    onEdit: (taskItem: TaskItemTable) => void;
    onDelete: (taskItem: TaskItemTable) => void;
    onToggleCompleted?: (taskItem: TaskItemTable) => void;
}

export const TaskItemsTable = ({
    taskItems,
    totalTaskItems,
    page,
    pageSize,
    loading,
    onPageChange,
    onPageSizeChange,
    onEdit,
    onDelete,
    onToggleCompleted
}: TaskItemsTableProps) => {
    if (!loading && taskItems.length === 0) {
        return (
            <Box mt={3}>
                <Typography>Nenhuma tarefa encontrada.</Typography>
            </Box>
        );
    }

    return (
        <Box mt={3}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Concluída</TableCell>
                        <TableCell>Título</TableCell>
                        <TableCell>Descrição</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Criada em</TableCell>
                        <TableCell align="right">Ações</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {taskItems.map((taskItem) => (
                        <TableRow key={taskItem.id}>
                            <TableCell>
                                <Checkbox
                                    checked={taskItem.completed}
                                    onChange={() => onToggleCompleted && onToggleCompleted(taskItem)}
                                />
                            </TableCell>
                            <TableCell>{taskItem.title}</TableCell>
                            <TableCell>{taskItem.description}</TableCell>
                            <TableCell>
                                <Chip
                                    label={taskItem.completed ? 'Concluída' : 'Pendente'}
                                    color={taskItem.completed ? 'success' : 'warning'}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>
                                {new Date(taskItem.createdAt).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell align="right">
                                <Tooltip title="Editar">
                                    <IconButton onClick={() => onEdit(taskItem)}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Excluir">
                                    <IconButton onClick={() => onDelete(taskItem)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <TablePagination
                component="div"
                count={totalTaskItems}
                page={page - 1}
                rowsPerPage={pageSize}
                onPageChange={(_, newPage) => onPageChange(newPage + 1)}
                onRowsPerPageChange={(event) =>
                    onPageSizeChange(Number(event.target.value))
                }
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage="Itens por página"
            />
        </Box>
    );
};