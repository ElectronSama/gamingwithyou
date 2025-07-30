using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Domain.Entities
{
    public class Product
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public long Price { get; set; }
        public string StripePriceId { get; set; }
        public TimeSpan Duration { get; set; }

        public Guid UserId { get; set; }
        public User User { get; set; }


        public Product()
        {
            
        }

        public Product(string title, string description, long price, TimeSpan duration, Guid userId, string stripePriceId)
        {
            Id = Guid.NewGuid();
            Title = title;
            Description = description;
            Price = price;
            Duration = duration;
            UserId = userId;
            StripePriceId = stripePriceId;
        }
    }
}
