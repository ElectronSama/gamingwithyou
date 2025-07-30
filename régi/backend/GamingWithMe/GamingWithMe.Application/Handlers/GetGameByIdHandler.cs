using AutoMapper;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Application.Queries;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class GetGameByIdHandler : IRequestHandler<GetGameByIdQuery, GameDto?>
    {
        private readonly IAsyncRepository<Game> _repo;
        private readonly IMapper _mapper;

        public GetGameByIdHandler(IAsyncRepository<Game> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }
        public async Task<GameDto?> Handle(GetGameByIdQuery request, CancellationToken cancellationToken)
        {
            var game = await _repo.GetByIdAsync(request.GameId);
            return game == null ? null : _mapper.Map<GameDto>(game);
        }
    }
}
