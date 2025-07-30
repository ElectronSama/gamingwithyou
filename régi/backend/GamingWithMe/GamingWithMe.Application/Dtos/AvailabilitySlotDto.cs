using System;

namespace GamingWithMe.Application.Dtos
{
    public record AvailabilitySlotDto(
        Guid Id,
        DateTime Date,
        string StartTime,
        string EndTime,
        bool IsAvailable,
        long Price
    );
}   