using Api.Data;
using Api.Dtos.TaskItems;
using Api.Helpers.Pagination;

namespace Api.Services.TaskItemsServices;

public class SearchTaskItems
{
    private readonly ApiDbContext _context;

    public SearchTaskItems(ApiDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<TaskItemResponseDto>> ExecuteAsync(string key, int page = 1, int pageSize = 10)
    {
        key = key.Trim().ToLower();

        var query = _context.TaskItems
            .Where(t =>
            t.Active && (t.Title.ToLower().Contains(key) || t.Description.ToLower().Contains(key)))
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


        return await PagedResult<TaskItemResponseDto>.CreateAsync(query, page, pageSize);
    }
}

