using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniProjectManager.DTOs;

namespace MiniProjectManager.Controllers
{
    [ApiController]
    [Route("api/v1/projects/{projectId}/schedule")]
    public class SchedulerController : ControllerBase
    {
        // POST api/v1/projects/{projectId}/schedule
        [HttpPost]
        public ActionResult<ScheduleResponse> Schedule(string projectId, [FromBody] ScheduleRequest request)
        {
            if (!ModelState.IsValid || request.Tasks.Count == 0)
            {
                return BadRequest("Provide at least one task");
            }

            // Validate duplicate titles (case-insensitive)
            var duplicates = request.Tasks
                .GroupBy(t => t.Title, StringComparer.OrdinalIgnoreCase)
                .Where(g => g.Count() > 1)
                .Select(g => g.Key)
                .ToList();
            if (duplicates.Count > 0)
            {
                return BadRequest($"Duplicate task titles found: {string.Join(", ", duplicates)}. Please ensure titles are unique.");
            }

            // Build graph by task title
            var titleToTask = request.Tasks.ToDictionary(t => t.Title, t => t, StringComparer.OrdinalIgnoreCase);
            var indegree = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
            var graph = new Dictionary<string, List<string>>(StringComparer.OrdinalIgnoreCase);

            foreach (var t in request.Tasks)
            {
                if (!graph.ContainsKey(t.Title)) graph[t.Title] = new List<string>();
                if (!indegree.ContainsKey(t.Title)) indegree[t.Title] = 0;
            }

            foreach (var t in request.Tasks)
            {
                foreach (var dep in t.Dependencies ?? new List<string>())
                {
                    if (!titleToTask.ContainsKey(dep))
                    {
                        return BadRequest($"Unknown dependency '{dep}' referenced by '{t.Title}'");
                    }
                    graph[dep].Add(t.Title);
                    indegree[t.Title] = indegree.GetValueOrDefault(t.Title) + 1;
                }
            }

            // Kahn's algorithm with due date + estimated hours tie-breakers
            var queue = new List<string>(indegree.Where(kv => kv.Value == 0).Select(kv => kv.Key));
            var result = new List<string>();

            int CompareTasks(string a, string b)
            {
                var ta = titleToTask[a];
                var tb = titleToTask[b];
                // Earlier due date first
                var ad = ta.DueDate ?? DateTime.MaxValue;
                var bd = tb.DueDate ?? DateTime.MaxValue;
                var cmp = ad.CompareTo(bd);
                if (cmp != 0) return cmp;
                // Larger tasks earlier to de-risk
                var ah = ta.EstimatedHours ?? 0;
                var bh = tb.EstimatedHours ?? 0;
                return -ah.CompareTo(bh);
            }

            queue.Sort(CompareTasks);

            while (queue.Count > 0)
            {
                var current = queue[0];
                queue.RemoveAt(0);
                result.Add(current);

                foreach (var nxt in graph[current])
                {
                    indegree[nxt]--;
                    if (indegree[nxt] == 0)
                    {
                        queue.Add(nxt);
                    }
                }
                queue.Sort(CompareTasks);
            }

            if (result.Count != request.Tasks.Count)
            {
                return BadRequest("Cycle detected in dependencies");
            }

            return Ok(new ScheduleResponse { RecommendedOrder = result });
        }
    }
}


