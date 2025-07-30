using GamingWithMe.Application.Dtos;
using MediatR;
using System;
using System.Collections.Generic;

namespace GamingWithMe.Application.Queries
{
    public record GetGameEasterEggsByGameIdQuery(Guid GameId) : IRequest<List<GameEasterEggDto>>;
}