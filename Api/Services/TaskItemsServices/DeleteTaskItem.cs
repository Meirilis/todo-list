using Api.Data;
using Api.Middlewares;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Api.Services.TaskItemsServices;

public class DeleteTaskItem
{
    private readonly ApiDbContext _context;

    public DeleteTaskItem(ApiDbContext context)
    {
        _context = context;
    }
    public async Task ExecuteAsync(int id, int authUserId)
    {
        var taskItem = await _context.TaskItems.FirstOrDefaultAsync(t => t.Id == id && t.Active);

        if (taskItem == null)
        {
            throw new AppException($"Tarefa com ID {id} não encontrada.", (int)HttpStatusCode.NotFound);
        }

        taskItem.Active = false;
        taskItem.UpdatedAt = DateTime.UtcNow;

        _context.TaskItems.Update(taskItem);
        await _context.SaveChangesAsync();
    }
}