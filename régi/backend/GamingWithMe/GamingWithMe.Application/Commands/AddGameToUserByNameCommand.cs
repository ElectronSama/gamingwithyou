using MediatR;

namespace GamingWithMe.Application.Commands
{
    public record AddGameToUserByNameCommand(string UserId, string GameName) : IRequest<bool>;
}