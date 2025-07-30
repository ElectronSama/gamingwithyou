using GamingWithMe.Application.Dtos;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;

namespace GamingWithMe.Application.Commands
{
    public record CreateFixedServiceCommand(
        string UserId,
        CreateFixedServiceDto ServiceDto
    ) : IRequest<Guid>;
}