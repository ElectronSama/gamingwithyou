using System;

namespace GamingWithMe.Application.Dtos
{
    public record DailyAvailabilityDto(
        DateTime Date,
        string StartTime,
        string SessionDuration,
        long price
    );
}