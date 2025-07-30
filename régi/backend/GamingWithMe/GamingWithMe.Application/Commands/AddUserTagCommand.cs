using MediatR;
using System;

namespace GamingWithMe.Application.Commands
{
    public record AddUserTagCommand(string UserId, Guid TagId) : IRequest<bool>;
}