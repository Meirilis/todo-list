namespace Api.Models
{
    public class TaskItem : AuditableEntity
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool Completed { get; set; } = false;
        public bool Active { get; set; } = true;
    }
}