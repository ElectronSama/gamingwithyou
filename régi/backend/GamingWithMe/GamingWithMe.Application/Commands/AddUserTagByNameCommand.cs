using MediatR;

namespace GamingWithMe.Application.Commands
{
    public record AddUserTagByNameCommand(string UserId, string TagName) : IRequest<bool>;
}