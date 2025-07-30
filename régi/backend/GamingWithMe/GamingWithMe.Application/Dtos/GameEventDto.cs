using GamingWithMe.Domain.Entities;
using System;

namespace GamingWithMe.Application.Dtos
{
    public record GameEventDto(
        string Title,
        DateTime StartDate,
        DateTime EndDate,
        decimal PrizePool,
        int NumberOfTeams,
        string Location,
        string Status,
        string GameName
    );
}