using MiniProjectManager.Models;

namespace MiniProjectManager.Services;

public interface IProjectService
{
    IEnumerable<Project> GetByOwner(Guid ownerId);
    Project? Get(Guid id);
    Project Create(Project project);
    bool Delete(Guid id, Guid ownerId);

    // Added methods for task operations
    IEnumerable<TaskItem> GetTasksForProject(Guid projectId);
    TaskItem? GetTask(Guid id);
    TaskItem CreateTask(TaskItem item);
    bool UpdateTask(TaskItem updated);
    bool DeleteTask(Guid id);
}
