namespace MiniProjectManager.DTOs;

public record CreateProjectRequest(string Title, string? Description);
public record ProjectResponse(Guid Id, string Title, string? Description, DateTime CreatedAt);

public class BulkCreateProjectsRequest
{
    public List<string> Titles { get; set; } = new();
}

public class ProjectStatsResponse
{
    public int Total { get; set; }
    public int ThisWeek { get; set; }
    public int Today { get; set; }
}
