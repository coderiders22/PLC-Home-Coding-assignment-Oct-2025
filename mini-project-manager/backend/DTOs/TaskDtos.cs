namespace MiniProjectManager.DTOs;

public record CreateTaskRequest(string Title, DateTime? DueDate);
public record UpdateTaskRequest(string? Title, DateTime? DueDate, bool? Completed);
public record TaskResponse(Guid Id, Guid ProjectId, string Title, DateTime? DueDate, bool Completed);
