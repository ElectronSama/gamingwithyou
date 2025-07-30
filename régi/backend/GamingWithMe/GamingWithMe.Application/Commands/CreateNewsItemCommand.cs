using GamingWithMe.Application.Dtos;
using MediatR;

namespace GamingWithMe.Application.Commands
{
    public record CreateNewsItemCommand(string Title, string Content, Guid GameId) : IRequest<NewsDto>;
}