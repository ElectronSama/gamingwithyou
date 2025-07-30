using MediatR;
using System;
using System.Collections.Generic;
using GamingWithMe.Application.Dtos;

namespace GamingWithMe.Application.Queries
{
    public record GetUserDailyAvailabilityByUsernameQuery(string Username, DateTime Date) 
        : IRequest<IEnumerable<AvailabilitySlotDto>>;
}