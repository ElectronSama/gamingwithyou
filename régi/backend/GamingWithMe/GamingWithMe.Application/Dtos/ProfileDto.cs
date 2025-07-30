using System;
using System.Collections.Generic;

namespace GamingWithMe.Application.Dtos
{
    public record ProfileDto(
        Guid Id,
        string username,
        string avatarurl,
        string bio,
        bool isActive,
        List<string> languages,
        List<string> games,
        List<string> tags,
        bool hasStripeAccount,        
        List<AvailabilitySlotDto> availability, 
        DateTime joined,
        string? twitterUrl,
    string? instagramUrl,
    string? facebookUrl


    )
    {
        public ProfileDto() : this(Guid.Empty, string.Empty, string.Empty, string.Empty, false, new List<string>(), new List<string>(), new List<string>(), false, new List<AvailabilitySlotDto>(), default, string.Empty, string.Empty, string.Empty) { }
    }

    
    
    public record BookingSummaryDto(
        Guid Id,
        DateTime StartTime,
        TimeSpan Duration,
        string CustomerName
    );
}
