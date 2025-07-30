using MediatR;

namespace GamingWithMe.Application.Commands
{
    public record UpdateUsernameCommand(string UserId, string NewUsername) : IRequest<bool>;
}