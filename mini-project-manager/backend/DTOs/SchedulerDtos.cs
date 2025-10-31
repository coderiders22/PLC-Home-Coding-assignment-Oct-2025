using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.DTOs
{
    public class ScheduleTaskInput
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        public int? EstimatedHours { get; set; }
        public DateTime? DueDate { get; set; }
        public List<string> Dependencies { get; set; } = new();
    }

    public class ScheduleRequest
    {
        [Required]
        public List<ScheduleTaskInput> Tasks { get; set; } = new();
    }

    public class ScheduleResponse
    {
        public List<string> RecommendedOrder { get; set; } = new();
    }
}


