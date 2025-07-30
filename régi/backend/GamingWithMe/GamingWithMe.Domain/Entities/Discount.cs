using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Domain.Entities
{
    public class Discount
    {
        public Guid Id { get; set; }
        public string StripeId { get; set; }
        public string Name { get; set; }
        public decimal PercentOff {  get; set; }
        public int Duration { get; set; }
        public int? MaxRedemptions { get; set; }

        public Guid UserId { get; set; }
        public User User { get; set; }

        public Discount()
        {
            
        }

        public Discount(string stripeId, string name, int duration, int? maxRedemptions, Guid userId, decimal percentOff)
        {
            Id = Guid.NewGuid();
            StripeId = stripeId;
            Name = name;
            Duration = duration;
            MaxRedemptions = maxRedemptions;
            UserId = userId;
            PercentOff = percentOff;
        }
    }
}
