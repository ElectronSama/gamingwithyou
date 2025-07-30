using System;

namespace GamingWithMe.Domain.Entities
{
    public enum OrderStatus
    {
        Pending,
        InProgress,
        Completed,
        Cancelled,
        Refunded
    }

    public class ServiceOrder
    {
        public Guid Id { get; set; }
        public Guid ServiceId { get; set; }
        public FixedService Service { get; set; }
        public Guid CustomerId { get; set; }
        public User Customer { get; set; }
        public Guid ProviderId { get; set; }
        public User Provider { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public DateTime OrderDate { get; set; }
        public DateTime DeliveryDeadline { get; set; }
        public DateTime? CompletedDate { get; set; }
        public string PaymentIntentId { get; set; }
        public string? CustomerNotes { get; set; }
        public string? ProviderNotes { get; set; }

        public ServiceOrder()
        {
            Id = Guid.NewGuid();
            OrderDate = DateTime.UtcNow;
        }

        public ServiceOrder(Guid serviceId, Guid customerId, Guid providerId, string paymentIntentId, 
            int deadlineInDays, string? customerNotes = null) : this()
        {
            ServiceId = serviceId;
            CustomerId = customerId;
            ProviderId = providerId;
            PaymentIntentId = paymentIntentId;
            CustomerNotes = customerNotes;
            DeliveryDeadline = DateTime.UtcNow.AddDays(deadlineInDays);
        }

        public bool IsOverdue()
        {
            return DateTime.UtcNow > DeliveryDeadline && Status != OrderStatus.Completed;
        }
    }
}