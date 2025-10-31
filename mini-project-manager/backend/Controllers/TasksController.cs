using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using MiniProjectManager.DTOs;
using MiniProjectManager.Models;
using MiniProjectManager.Services;

namespace MiniProjectManager.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly IProjectService _projectService;

    public TasksController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    // 🔹 Safe helper to extract current user ID from JWT claims
    private Guid CurrentUserId()
    {
        var subClaim = User.Claims.FirstOrDefault(c =>
            c.Type == JwtRegisteredClaimNames.Sub ||
            c.Type == "sub" ||
            c.Type.EndsWith("/nameidentifier"));

        if (subClaim == null)
            throw new Exception("Invalid or missing user claim.");

        return Guid.Parse(subClaim.Value);
    }

    // 🔹 POST /api/projects/{projectId}/tasks
    [HttpPost("projects/{projectId:guid}/tasks")]
    public ActionResult<TaskResponse> CreateTask(Guid projectId, [FromBody] CreateTaskRequest req)
    {
        var userId = CurrentUserId();

        var project = _projectService.Get(projectId);
        if (project == null || project.OwnerId != userId)
            return NotFound("Project not found.");

        if (string.IsNullOrWhiteSpace(req.Title))
            return BadRequest("Title required.");

        var t = new TaskItem
        {
            ProjectId = projectId,
            Title = req.Title,
            DueDate = req.DueDate
        };

        var created = (_projectService as ProjectService)!.CreateTask(t);

        return Ok(new TaskResponse(created.Id, created.ProjectId, created.Title, created.DueDate, created.Completed));
    }

    // 🔹 PUT /api/tasks/{taskId}
    [HttpPut("tasks/{taskId:guid}")]
    public ActionResult<TaskResponse> UpdateTask(Guid taskId, [FromBody] UpdateTaskRequest req)
    {
        var userId = CurrentUserId();

        var existing = (_projectService as ProjectService)!.GetTask(taskId);
        if (existing == null)
            return NotFound("Task not found.");

        var project = _projectService.Get(existing.ProjectId);
        if (project == null || project.OwnerId != userId)
            return Forbid();

        if (!string.IsNullOrWhiteSpace(req.Title))
            existing.Title = req.Title;
        if (req.DueDate != null)
            existing.DueDate = req.DueDate;
        if (req.Completed != null)
            existing.Completed = req.Completed.Value;

        _projectService.UpdateTask(existing);

        return Ok(new TaskResponse(existing.Id, existing.ProjectId, existing.Title, existing.DueDate, existing.Completed));
    }

    // 🔹 DELETE /api/tasks/{taskId}
    [HttpDelete("tasks/{taskId:guid}")]
    public ActionResult DeleteTask(Guid taskId)
    {
        var userId = CurrentUserId();

        var existing = (_projectService as ProjectService)!.GetTask(taskId);
        if (existing == null)
            return NotFound("Task not found.");

        var project = _projectService.Get(existing.ProjectId);
        if (project == null || project.OwnerId != userId)
            return Forbid();

        _projectService.DeleteTask(taskId);

        return NoContent();
    }
}
