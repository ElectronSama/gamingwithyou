using MediatR;
using System;

namespace GamingWithMe.Application.Commands
{
    public record DeleteServiceOrderCommand(Guid OrderId) : IRequest<bool>;
}