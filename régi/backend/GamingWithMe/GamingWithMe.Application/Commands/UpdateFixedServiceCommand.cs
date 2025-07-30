using GamingWithMe.Application.Dtos;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;

namespace GamingWithMe.Application.Commands
{
    public record UpdateFixedServiceCommand(
        Guid ServiceId,
        string UserId,
        string Title,
        string Description,
        ServiceStatus Status
    ) : IRequest<bool>;
}