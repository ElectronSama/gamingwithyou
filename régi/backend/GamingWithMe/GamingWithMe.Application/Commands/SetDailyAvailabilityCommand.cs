using GamingWithMe.Application.Dtos;
using MediatR;
using System;

namespace GamingWithMe.Application.Commands
{
    public record SetDailyAvailabilityCommand(string UserId, DailyAvailabilityDto Availability) : IRequest<bool>;
}