using MediatR;

namespace GamingWithMe.Application.Commands
{
    public record RemoveUserTagByNameCommand(string UserId, string TagName) : IRequest<bool>;
}