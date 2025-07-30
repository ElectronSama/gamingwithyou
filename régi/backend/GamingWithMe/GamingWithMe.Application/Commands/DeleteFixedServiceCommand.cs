using MediatR;
using System;

namespace GamingWithMe.Application.Commands
{
    public record DeleteFixedServiceCommand(
        Guid ServiceId,
        string UserId
    ) : IRequest<bool>;
}