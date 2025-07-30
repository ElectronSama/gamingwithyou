using MediatR;
using System;

namespace GamingWithMe.Application.Commands
{
    public record RemoveUserTagCommand(string UserId, Guid TagId) : IRequest<bool>;
}