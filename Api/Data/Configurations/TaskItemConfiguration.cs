using Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Data.Configurations
{
    public class TaskItemConfiguration : IEntityTypeConfiguration<TaskItem>
    {
        public void Configure(EntityTypeBuilder<TaskItem> builder)
        {
            builder.ToTable("task_items");
            builder.HasKey(t => t.Id);
            builder.Property(t => t.Title).IsRequired().HasMaxLength(255);
            builder.Property(t => t.Description).HasMaxLength(1000);
            builder.Property(t => t.Completed).HasDefaultValue(false);
            builder.Property(t => t.Active).HasDefaultValue(true);
            builder.Property(t => t.CreatedAt).HasDefaultValueSql("NOW()");
            builder.Property(t => t.UpdatedAt).HasDefaultValueSql("NOW()");
        }
    }
}