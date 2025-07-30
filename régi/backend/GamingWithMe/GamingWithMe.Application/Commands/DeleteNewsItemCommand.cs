using MediatR;

namespace GamingWithMe.Application.Commands
{
    public record DeleteNewsItemCommand(Guid NewsId) : IRequest<bool>;
}