using System;

namespace GamingWithMe.Application.Dtos
{
    public record BillingRecordDto(
        Guid BookingId,
        DateTime TransactionDate,
        decimal Amount,
        string TransactionType,
        string OtherPartyUsername,
        string OtherPartyAvatarUrl
    );

    public record UpcomingBookingDto(
        Guid BookingId,
        DateTime StartTime,
        TimeSpan Duration,
        string OtherPartyUsername,
        string OtherPartyAvatarUrl
    );
}