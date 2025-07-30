using GamingWithMe.Application.Dtos;
using MediatR;
using System;
using System.Collections.Generic;

namespace GamingWithMe.Application.Queries
{
    public record GetGameEventsByGameIdQuery(Guid GameId) : IRequest<List<GameEventDto>>;
}