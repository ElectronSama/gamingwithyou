using GamingWithMe.Domain.Entities;
using MediatR;
using System;

namespace GamingWithMe.Application.Commands
{
    public record UpdateServiceOrderStatusCommand(
        Guid OrderId,
        string ProviderId,
        OrderStatus Status,
        string? ProviderNotes = null
    ) : IRequest<bool>;
}