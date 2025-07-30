using GamingWithMe.Application.Dtos;
using MediatR;
using System;

namespace GamingWithMe.Application.Commands
{
    public record CreateServiceOrderCommand(
        string CustomerId,
        CreateServiceOrderDto OrderDto,
        string PaymentIntentId
    ) : IRequest<Guid>;
}