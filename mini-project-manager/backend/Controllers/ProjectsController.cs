using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using MiniProjectManager.DTOs;
using MiniProjectManager.Models;
using MiniProjectManager.Services;

namespace MiniProjectManager.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    // 🔹 Unified helper to safely extract user ID from JWT claims
    private Guid GetUserId()
    {
        var subClaim = User.Claims.FirstOrDefault(c =>
            c.Type == JwtRegisteredClaimNames.Sub ||
            c.Type == "sub" ||
            c.Type.EndsWith("/nameidentifier"));

        if (subClaim == null)
            throw new Exception("Missing user claim.");

        return Guid.Parse(subClaim.Value);
    }

    // 🔹 GET /api/projects
    [HttpGet]
    public ActionResult<IEnumerable<ProjectResponse>> Get()
    {
        var userId = GetUserId();

        var projects = _projectService.GetByOwner(userId)
            .Select(p => new ProjectResponse(p.Id, p.Title, p.Description, p.CreatedAt));

        return Ok(projects);
    }

    // 🔹 POST /api/projects
    [HttpPost]
    public ActionResult<ProjectResponse> Create([FromBody] CreateProjectRequest req)
    {
        if (req.Title is null || req.Title.Length < 3 || req.Title.Length > 100)
            return BadRequest("Title must be 3-100 characters.");

        var userId = GetUserId();

        // Prevent duplicate titles per user (case-insensitive)
        if (_projectService.GetByOwner(userId).Any(p => p.Title.Equals(req.Title, StringComparison.OrdinalIgnoreCase)))
        {
            return BadRequest("A project with this title already exists.");
        }

        var project = new Project
        {
            Title = req.Title,
            Description = req.Description,
            OwnerId = userId
        };

        _projectService.Create(project);

        return Ok(new ProjectResponse(project.Id, project.Title, project.Description, project.CreatedAt));
    }

    // 🔹 GET /api/projects/{id}
    [HttpGet("{id:guid}")]
    public ActionResult GetById(Guid id)
    {
        var userId = GetUserId();

        var project = _projectService.Get(id);
        if (project == null || project.OwnerId != userId)
            return NotFound();

        var tasks = (_projectService as ProjectService)!
            .GetTasksForProject(id)
            .Select(t => new TaskResponse(t.Id, t.ProjectId, t.Title, t.DueDate, t.Completed));

        var response = new
        {
            Id = project.Id,
            Title = project.Title,
            Description = project.Description,
            CreatedAt = project.CreatedAt,
            Tasks = tasks
        };

        return Ok(response);
    }

    // 🔹 DELETE /api/projects/{id}
    [HttpDelete("{id:guid}")]
    public ActionResult Delete(Guid id)
    {
        var userId = GetUserId();

        if (!_projectService.Delete(id, userId))
            return NotFound();

        return NoContent();
    }

    // 🔹 POST /api/projects/bulk
    [HttpPost("bulk")]
    public ActionResult<IEnumerable<ProjectResponse>> BulkCreate([FromBody] BulkCreateProjectsRequest req)
    {
        var userId = GetUserId();
        if (req?.Titles == null || req.Titles.Count == 0) return BadRequest("Provide at least one title");

        var created = new List<ProjectResponse>();
        var existingTitles = new HashSet<string>(_projectService.GetByOwner(userId).Select(p => p.Title), StringComparer.OrdinalIgnoreCase);
        var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var title in req.Titles.Where(t => !string.IsNullOrWhiteSpace(t)))
        {
            if (title.Length < 3 || title.Length > 100) continue;
            if (existingTitles.Contains(title) || !seen.Add(title)) continue;
            var p = new Project { Title = title.Trim(), OwnerId = userId };
            _projectService.Create(p);
            created.Add(new ProjectResponse(p.Id, p.Title, p.Description, p.CreatedAt));
        }
        return Ok(created);
    }

    // 🔹 GET /api/projects/stats
    [HttpGet("stats")]
    public ActionResult<ProjectStatsResponse> Stats()
    {
        var userId = GetUserId();
        var list = _projectService.GetByOwner(userId).ToList();

        var today = DateTime.UtcNow.Date;
        var startOfWeek = today.AddDays(-(int)today.DayOfWeek);

        var resp = new ProjectStatsResponse
        {
            Total = list.Count,
            ThisWeek = list.Count(p => p.CreatedAt.Date >= startOfWeek),
            Today = list.Count(p => p.CreatedAt.Date == today)
        };
        return Ok(resp);
    }
}
