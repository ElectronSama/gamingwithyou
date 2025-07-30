using MediatR;

namespace GamingWithMe.Application.Commands
{
    public record DeleteGameFromUserByNameCommand(string UserId, string GameName) : IRequest<bool>;
}