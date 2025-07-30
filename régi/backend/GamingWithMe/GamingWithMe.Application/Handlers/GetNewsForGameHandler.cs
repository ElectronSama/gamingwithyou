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
    public class GetNewsForGameHandler : IRequestHandler<GetNewsForGameQuery, List<NewsDto>>
    {
        private readonly IAsyncRepository<GameNews> _repo;
        private readonly IMapper _mapper;

        public GetNewsForGameHandler(IAsyncRepository<GameNews> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<List<NewsDto>> Handle(GetNewsForGameQuery request, CancellationToken cancellationToken)
        {
            var news = (await _repo.ListAsync(cancellationToken)).Where(x => x.GameId == request.gameId).OrderByDescending(x => x.PublishedAt).ToList();

            if (news.Count == 0)
            {
                return new List<NewsDto>();
            }

            return _mapper.Map<List<NewsDto>>(news);
        }
    }
}
