using MediatR;
using System;

namespace GamingWithMe.Application.Commands
{
    public record DeleteDailyAvailabilityCommand(string UserId, DateTime Date, string StartTime) : IRequest<bool>;
}