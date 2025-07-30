using MediatR;
using System;

namespace GamingWithMe.Application.Commands
{
    public record DeleteGameEventCommand(Guid EventId) : IRequest<bool>;
}