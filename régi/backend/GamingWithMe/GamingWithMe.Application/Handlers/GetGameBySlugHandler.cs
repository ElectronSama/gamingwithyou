using AutoMapper;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Application.Queries;
using GamingWithMe.Domain.Entities;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class GetGameBySlugHandler : IRequestHandler<GetGameBySlugQuery, GameDto?>
    {
        private readonly IAsyncRepository<Game> _repo;
        private readonly IMapper _mapper;

        public GetGameBySlugHandler(IAsyncRepository<Game> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<GameDto?> Handle(GetGameBySlugQuery request, CancellationToken cancellationToken)
        {
            var game = (await _repo.ListAsync(cancellationToken)).FirstOrDefault(g => g.Slug == request.Slug);
            return game == null ? null : _mapper.Map<GameDto>(game);
        }
    }
}