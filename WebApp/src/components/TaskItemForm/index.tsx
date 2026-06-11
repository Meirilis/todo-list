import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { TaskItem, TaskItemFormValues } from '../../interfaces/index';

interface TaskItemFormProps {
    taskItem?: TaskItem | null;
    onSubmit: (values: TaskItemFormValues) => Promise<void>;
    onCancel: () => void;
}

export const TaskItemForm = ({
    taskItem,
    onSubmit,
    onCancel
}: TaskItemFormProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [completed, setCompleted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const isEditing = Boolean(taskItem);

    useEffect(() => {
        if (taskItem) {
            setTitle(taskItem.title);
            setDescription(taskItem.description);
            setCompleted(taskItem.completed);
            return;
        }

        setTitle('');
        setDescription('');
        setCompleted(false);
    }, [taskItem]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!title.trim()) {
            return;
        }

        try {
            setSubmitting(true);
            await onSubmit({
                id: taskItem?.id,
                title: title.trim(),
                description: description.trim(),
                completed: isEditing ? completed : false,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <TextField
                label="Título"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                fullWidth
                required
                margin="normal"
            />

            <TextField
                label="Descrição"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                fullWidth
                multiline
                minRows={3}
                margin="normal"
            />
            {isEditing && (
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={completed}
                            onChange={(event) => setCompleted(event.target.checked)}
                        />
                    }
                    label="Concluída"
                />
            )}
            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                >
                    {isEditing ? 'Salvar' : 'Criar'}
                </Button>
                <Button
                    disabled={submitting}
                    onClick={onCancel}
                >
                    Cancelar
                </Button>
            </Box>
        </Box>
    );
};
