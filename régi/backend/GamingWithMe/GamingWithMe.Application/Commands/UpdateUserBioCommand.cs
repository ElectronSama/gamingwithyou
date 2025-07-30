using MediatR;

namespace GamingWithMe.Application.Commands
{
    public record UpdateUserBioCommand(string UserId, string Bio) : IRequest<bool>;
}