using GamingWithMe.Application.Dtos;
using MediatR;

namespace GamingWithMe.Application.Queries
{
    public record GetNewsItemByIdQuery(Guid NewsId) : IRequest<NewsDto>;
}