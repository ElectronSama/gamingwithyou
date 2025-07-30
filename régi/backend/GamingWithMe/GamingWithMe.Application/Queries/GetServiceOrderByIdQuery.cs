using GamingWithMe.Domain.Entities;
using MediatR;
using System;

namespace GamingWithMe.Application.Queries
{
    public record GetServiceOrderByIdQuery(Guid Id) : IRequest<ServiceOrder?>;
}