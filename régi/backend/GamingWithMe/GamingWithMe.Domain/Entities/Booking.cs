using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Domain.Entities
{
    public class Booking
    {
        public Guid Id { get; set; }
        public Guid ProviderId { get; set; }
        public User Provider { get; set; }

        public Guid CustomerId { get; set; }
        public User Customer { get; set; }

        public DateTime StartTime { get; set; }
        public TimeSpan Duration { get; set; }
        public DateTime CreatedAt { get; set; }
        public string PaymentIntentId { get; set; }
        public decimal Amount { get; set; }
        public Guid? UserAvailabilityId { get; set; }

        public Booking()
        {
            
        }

        public Booking(Guid ProviderId, Guid CustomerId, DateTime StartTime, TimeSpan Duration, string paymentIntentId)
        {
            this.ProviderId = ProviderId;
            this.CustomerId = CustomerId;
            this.StartTime = StartTime;
            this.Duration = Duration;
            CreatedAt = DateTime.UtcNow;
            PaymentIntentId = paymentIntentId;
        }

    }
}
