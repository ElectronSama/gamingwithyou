using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GamingWithMe.Domain.Entities
{
    public enum ServiceDeadline
    {
        OneDay = 1,
        OneWeek = 7,
        TwoWeeks = 14
    }

    public enum ServiceStatus
    {
        Active,
        Inactive,
        Completed,
        Cancelled
    }

    public class FixedService
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public long Price { get; set; }
        public ServiceDeadline DeliveryDeadline { get; set; }

        public ServiceStatus Status { get; set; } = ServiceStatus.Active;
        public Guid UserId { get; set; }
        public User User { get; set; }
        public DateTime CreatedAt { get; set; }


        public FixedService()
        {
            Id = Guid.NewGuid();
            CreatedAt = DateTime.UtcNow;
        }

        public FixedService(string title, string description, long price, ServiceDeadline deliveryDeadline, 
            Guid userId) : this()
        {
            Title = title;
            Description = description;
            Price = price;
            DeliveryDeadline = deliveryDeadline;
            UserId = userId;
        }

        public int GetDeadlineInDays()
        {
            return (int)DeliveryDeadline;
        }
    }
}