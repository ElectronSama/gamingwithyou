using GamingWithMe.Application.Dtos;
using MediatR;
using System;
using System.Collections.Generic;

namespace GamingWithMe.Application.Queries
{
    public record GetServiceOrdersQuery(
        string UserId,
        bool AsProvider = false
    ) : IRequest<List<ServiceOrderDto>>;
}