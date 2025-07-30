using GamingWithMe.Application.Dtos;
using MediatR;
using System;

namespace GamingWithMe.Application.Commands
{
    public record CreateGameEventCommand(
        string Title,
        DateTime StartDate, 
        DateTime EndDate,
        decimal PrizePool,
        int NumberOfTeams,
        string Location,
        Guid GameId
    ) : IRequest<GameEventDto>;
}