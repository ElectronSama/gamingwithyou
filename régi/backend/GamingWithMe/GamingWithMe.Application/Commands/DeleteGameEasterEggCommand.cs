using MediatR;
using System;

namespace GamingWithMe.Application.Commands
{
    public record DeleteGameEasterEggCommand(Guid EasterEggId) : IRequest<bool>;
}