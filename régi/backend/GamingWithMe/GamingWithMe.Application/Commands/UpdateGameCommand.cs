using GamingWithMe.Application.Dtos;
using MediatR;
using System;

namespace GamingWithMe.Application.Commands
{
    public record UpdateGameCommand(Guid GameId, GameDto GameDto) : IRequest<bool>;
}