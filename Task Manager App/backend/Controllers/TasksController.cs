using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private static List<TaskItem> tasks = new();

        // GET /api/tasks - Display list of tasks
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(tasks);
        }

        // POST /api/tasks - Add new task
        [HttpPost]
        public IActionResult Add([FromBody] TaskItem task)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            task.Id = tasks.Count > 0 ? tasks.Max(t => t.Id) + 1 : 1;
            tasks.Add(task);
            return Ok(task);
        }

        // PUT /api/tasks/{id} - Toggle completion or full update (supports edit)
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] TaskItem task)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existing = tasks.FirstOrDefault(x => x.Id == id);
            if (existing == null) return NotFound();

            // Full update: Allow partial (e.g., only IsCompleted for toggle, or full for edit)
            existing.Description = task.Description ?? existing.Description;
            existing.IsCompleted = task.IsCompleted;
            existing.DueDate = task.DueDate ?? existing.DueDate;

            return Ok(existing);
        }

        // DELETE /api/tasks/{id} - Delete a task
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var existing = tasks.FirstOrDefault(x => x.Id == id);
            if (existing == null) return NotFound();
            tasks.Remove(existing);
            return NoContent();
        }
    }
}