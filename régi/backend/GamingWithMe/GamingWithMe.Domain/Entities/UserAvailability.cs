using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Domain.Entities
{
    public class UserAvailability
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }

        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan Duration { get; set; }
        public bool IsAvailable { get; set; } = true;
        public long Price { get; set; }

        public UserAvailability()
        {
        }

        public UserAvailability(Guid userId, DateTime date, TimeSpan startTime, TimeSpan duration, long price)
        {
            Id = Guid.NewGuid();
            UserId = userId;
            Date = date.Date;
            StartTime = startTime;
            Duration = duration;
            IsAvailable = true;
            Price = price;
        }
    }
}
