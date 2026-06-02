using Api.Data;
using Api.Dtos.TaskItems;
using Microsoft.EntityFrameworkCore;

namespace Api.Services.TaskItemsServices;

public class GetTaskItemOptions
{
    private readonly ApiDbContext _context;

    public GetTaskItemOptions(ApiDbContext context)
    {
        _context = context;
    }

    public async Task<List<TaskItemOptionsDto>> ExecuteAsync()
    {
        return await _context.TaskItems
            .Where(t => t.Active)
            .OrderBy(t => t.Title)
            .Select(t => new TaskItemOptionsDto
            {
                Id = t.Id,
                Title = t.Title
            })
            .ToListAsync();
    }
}