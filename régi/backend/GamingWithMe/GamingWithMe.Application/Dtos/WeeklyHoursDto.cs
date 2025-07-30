using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Dtos
{
    public record WeeklyHoursDto
    {
        public IDictionary<DayOfWeek, TimeRangeDto> Days { get; init; } = new Dictionary<DayOfWeek, TimeRangeDto>();
    }
}
