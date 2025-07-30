using GamingWithMe.Application.Dtos;
using MediatR;
using System;
using System.Collections.Generic;

namespace GamingWithMe.Application.Queries
{
    public record GetFixedServicesQuery(
        Guid? UserId = null,
        string? Category = null
    ) : IRequest<List<FixedServiceDto>>;
}