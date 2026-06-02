
using Api.Data;
using Api.Dtos.TaskItems;
using Api.Middlewares;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Api.Services.TaskItemsServices;

public class UpdateTaskItem
{
    private readonly ApiDbContext _context;

    public UpdateTaskItem(ApiDbContext context)
    {
        _context = context;
    }

    public async Task<TaskItemResponseDto> ExecuteAsync(int id, UpdateTaskItemDto dto, int authUserId)
    {
        var taskItem = await _context.TaskItems.FirstOrDefaultAsync(t => t.Id == id && t.Active);

        if (taskItem == null)
        {
            throw new AppException($"Tarefa com ID {id} não encontrada.", (int)HttpStatusCode.NotFound);
        }

        if(dto.Title != null)
        {
            if(string.IsNullOrWhiteSpace(dto.Title))
            {
                throw new AppException("O título da tarefa não pode ser vazio.", (int)HttpStatusCode.BadRequest);
            }
            taskItem.Title = dto.Title.Trim();
        }

        if(dto.Description != null)
        {
            taskItem.Description = dto.Description.Trim();
        }

        if (dto.Completed.HasValue)
        {
            taskItem.Completed = dto.Completed.Value;
        } 

        taskItem.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new TaskItemResponseDto
        {
            Id = taskItem.Id,
            Title = taskItem.Title,
            Description = taskItem.Description,
            Completed = taskItem.Completed,
            Active = taskItem.Active,
            CreatedAt = taskItem.CreatedAt,
            UpdatedAt = taskItem.UpdatedAt
        };
    }
}