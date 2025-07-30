using MediatR;
using System;
using System.Collections.Generic;
using GamingWithMe.Application.Dtos;

namespace GamingWithMe.Application.Queries
{
    public record GetDailyAvailabilityQuery(string UserId, DateTime Date) 
        : IRequest<IEnumerable<AvailabilitySlotDto>>;
}