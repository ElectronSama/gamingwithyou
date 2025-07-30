using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GamingWithMe.Domain.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public virtual IdentityUser IdentityUser { get; set; }
        public string StripeAccount { get; set; }
        public string StripeCustomer { get; set; }
        public string Username { get; set; }
        public string Bio { get; set; }
        public bool IsActive { get; set; }
        public string GoogleId { get; set; }
        public string FacebookId { get; set; }
        public string AvatarUrl { get; set; }
        public DateTime CreatedAt { get; set; }

        public string? TwitterUrl { get; set; }
        public string? InstagramUrl { get; set; }
        public string? FacebookUrl { get; set; }

        public ICollection<Booking> Bookings { get; set; }
        public ICollection<UserLanguage> Languages { get; set; }
        public ICollection<UserAvailability> DailyAvailability { get; set; }
        public ICollection<Product> Products { get; set; }
        public ICollection<UserGame> Games { get; set; }
        public ICollection<UserTag> Tags { get; set; }
        public ICollection<Discount> Discounts { get; set; }

        public ICollection<FixedService> FixedServices { get; set; }
        public ICollection<ServiceOrder> ServiceOrders { get; set; }
        public ICollection<ServiceOrder> ReceivedOrders { get; set; }

        public User()
        {
            Bookings = new List<Booking>();
            Languages = new List<UserLanguage>();
            DailyAvailability = new List<UserAvailability>();
            Products = new List<Product>();
            Games = new List<UserGame>();
            Tags = new List<UserTag>();
            Discounts = new List<Discount>();
            FixedServices = new List<FixedService>();
            ServiceOrders = new List<ServiceOrder>();
            ReceivedOrders = new List<ServiceOrder>();
        }

        public User(string userId, string username) : this()
        {
            Id = Guid.NewGuid();
            UserId = userId;
            Username = username;
            CreatedAt = DateTime.UtcNow;
            Bio = "";
            AvatarUrl = "";
            GoogleId = "";
            FacebookId = "";
            StripeAccount = "";
            StripeCustomer = "";
            TwitterUrl = "";
            InstagramUrl = "";
            FacebookUrl = "";
        }

        public bool IsGamer()
        {
            if (Tags == null || !Tags.Any())
                return false;

            return Tags.Any(ut => ut.Tag != null && ut.Tag.Name.Equals("Gamer", StringComparison.OrdinalIgnoreCase));
        }

        public bool CanUseBookingSystem()
        {
            return IsGamer();
        }
    }
}
