namespace MiniProjectManager.Models;

public class TaskItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProjectId { get; set; }
    public string Title { get; set; } = null!;
    public DateTime? DueDate { get; set; }
    public bool Completed { get; set; } = false;
}
