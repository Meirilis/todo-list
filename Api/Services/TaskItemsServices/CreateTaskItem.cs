using Api.Data;
using Api.Dtos.TaskItems;
using Api.Middlewares;
using Api.Models;
using System.Net;

namespace Api.Services.TaskItemsServices
{
    public class CreateTaskItem
    {
        private readonly ApiDbContext _context;

        public CreateTaskItem(ApiDbContext context)
        {
            _context = context;
        }

        public async Task<TaskItemResponseDto> ExecuteAsync(CreateTaskItemDto dto, int authUserId)
        {
            if(string.IsNullOrWhiteSpace(dto.Title))
            {
                throw new AppException("Título é obrigatório", (int)HttpStatusCode.BadRequest);
            }
            var taskItem = new TaskItem
            {
                Title = dto.Title.Trim(),
                Description = dto.Description.Trim(),
                Completed = false,
                Active = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.TaskItems.Add(taskItem);
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
}