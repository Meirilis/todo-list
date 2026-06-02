using Api.Data;
using Api.Dtos.TaskItems;
using Api.Middlewares;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Api.Services.TaskItemsServices;

public class GetTaskItemById
{
    private readonly ApiDbContext _context;

    public GetTaskItemById(ApiDbContext context)
    {
        _context = context;
    }

    public async Task<TaskItemResponseDto> ExecuteAsync(int id)
    {
        var taskItem = await _context.TaskItems.FirstOrDefaultAsync(t => t.Id == id && t.Active);

        if (taskItem == null)
        {
            throw new AppException($"Tarefa com ID {id} não encontrada.", (int)HttpStatusCode.NotFound);
        }

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