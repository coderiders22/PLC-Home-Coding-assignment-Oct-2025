using MiniProjectManager.Models;

namespace MiniProjectManager.Services;

public class ProjectService : IProjectService
{
    private readonly List<Project> _projects = new();
    private readonly List<TaskItem> _tasks = new(); // tasks stored here for simplicity

    public IEnumerable<Project> GetByOwner(Guid ownerId) => _projects.Where(p => p.OwnerId == ownerId);

    public Project? Get(Guid id) => _projects.FirstOrDefault(p => p.Id == id);

    public Project Create(Project project)
    {
        _projects.Add(project);
        return project;
    }

    public bool Delete(Guid id, Guid ownerId)
    {
        var p = Get(id);
        if (p == null || p.OwnerId != ownerId) return false;
        _projects.Remove(p);
        // remove tasks of that project
        _tasks.RemoveAll(t => t.ProjectId == id);
        return true;
    }

    // Additional helpers for tasks access (we'll use these from controllers)
    public IEnumerable<TaskItem> GetTasksForProject(Guid projectId) => _tasks.Where(t => t.ProjectId == projectId);
    public TaskItem? GetTask(Guid id) => _tasks.FirstOrDefault(t => t.Id == id);
    public TaskItem CreateTask(TaskItem item)
    {
        _tasks.Add(item);
        return item;
    }
    public bool UpdateTask(TaskItem updated)
    {
        var idx = _tasks.FindIndex(t => t.Id == updated.Id);
        if (idx == -1) return false;
        _tasks[idx] = updated;
        return true;
    }
    public bool DeleteTask(Guid id)
    {
        return _tasks.RemoveAll(t => t.Id == id) > 0;
    }
}
