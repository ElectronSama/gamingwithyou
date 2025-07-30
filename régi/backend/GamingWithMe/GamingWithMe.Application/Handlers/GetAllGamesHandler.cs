using AutoMapper;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Application.Queries;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class GetAllGamesHandler : IRequestHandler<GetAllGamesQuery, IEnumerable<GameDto>>
    {
        private readonly IAsyncRepository<Game> _repo;
        private readonly IMapper _mapper;

        public GetAllGamesHandler(IAsyncRepository<Game> repo, IMapper mapper) => (_repo, _mapper) = (repo, mapper);

        public async Task<IEnumerable<GameDto>> Handle(GetAllGamesQuery request, CancellationToken cancellationToken)
        {
            var games = await _repo.ListAsync(cancellationToken);
            return _mapper.Map<IEnumerable<GameDto>>(games) ?? Enumerable.Empty<GameDto>();
        }
    }
}
