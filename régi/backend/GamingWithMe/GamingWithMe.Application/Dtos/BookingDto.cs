using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Dtos
{
    public record BookingDto(Guid Id, string gamername, string username, DateTime startTime, TimeSpan duration, DateTime created);

    public record UserActivityDto(
        Guid Id,
        string Type, 
        string Title,
        string OtherPartyUsername,
        string OtherPartyAvatarUrl,
        DateTime Date,
        string Status,
        long Price,
        TimeSpan? Duration = null,
        DateTime? DeliveryDeadline = null
    );
}
