using System.ComponentModel.DataAnnotations;
namespace Api.Dtos.TaskItems;
public class UpdateTaskItemDto
{
    [MaxLength(255)]
    public string? Title { get; set; }
    [MaxLength(1000)]
    public string? Description { get; set; }
    public bool? Completed { get; set; }
}   