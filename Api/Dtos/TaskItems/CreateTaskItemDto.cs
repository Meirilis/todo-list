using System.ComponentModel.DataAnnotations;
namespace Api.Dtos.TaskItems
{
    public class CreateTaskItemDto
    {
        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;
        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;
    }
}