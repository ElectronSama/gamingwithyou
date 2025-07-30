using GamingWithMe.Domain.Entities;
using System;

namespace GamingWithMe.Application.Dtos
{
    public record FixedServiceDto(
        Guid Id,
        string Title,
        string Description,
        long Price,
        ServiceDeadline DeliveryDeadline,
        ServiceStatus Status,
        string Username,
        string AvatarUrl,
        DateTime CreatedAt
    )
    {
        
        public FixedServiceDto() : this(Guid.Empty, string.Empty, string.Empty, 0, ServiceDeadline.OneDay, ServiceStatus.Active, string.Empty, string.Empty, default)
        {
        }
    };

    public record CreateFixedServiceDto(
        string Title,
        string Description,
        long Price,
        ServiceDeadline DeliveryDeadline
    );

    public record ServiceOrderDto(
        Guid Id,
        Guid ServiceId,
        string ServiceTitle,
        string CustomerUsername,
        string ProviderUsername,
        OrderStatus Status,
        DateTime OrderDate,
        DateTime DeliveryDeadline,
        DateTime? CompletedDate,
        long Price,
        string? CustomerNotes,
        string? ProviderNotes,
        bool IsOverdue
    );

    public record CreateServiceOrderDto(
        Guid ServiceId,
        string? CustomerNotes = null
    );

    public record UpdateServiceOrderStatusDto(
        OrderStatus Status,
        string? ProviderNotes = null
    );
}