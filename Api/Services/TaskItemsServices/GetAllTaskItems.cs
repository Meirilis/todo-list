using Api.Data;
using Api.Dtos.TaskItems;
using Api.Helpers.Pagination;

namespace Api.Services.TaskItemsServices;

public class GetAllTaskItems
{
    private readonly ApiDbContext _context;

    public GetAllTaskItems(ApiDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<TaskItemResponseDto>> ExecuteAsync(
        int pageNumber = 1, 
        int pageSize = 10
    )
    {
        var query = _context.TaskItems
            .Where(t => t.Active)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new TaskItemResponseDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Completed = t.Completed,
                Active = t.Active,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt
            });

        return await PagedResult<TaskItemResponseDto>.CreateAsync(query, pageNumber, pageSize);
    }
}