using GamingWithMe.Application.Dtos;
using MediatR;

namespace GamingWithMe.Application.Queries
{
    public record GetGameBySlugQuery(string Slug) : IRequest<GameDto?>;
}