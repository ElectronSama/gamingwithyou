using AutoMapper;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Application.Queries;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class GetNewsItemByIdHandler : IRequestHandler<GetNewsItemByIdQuery, NewsDto>
    {
        private readonly IAsyncRepository<GameNews> _repo;
        private readonly IMapper _mapper;

        public GetNewsItemByIdHandler(IAsyncRepository<GameNews> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<NewsDto> Handle(GetNewsItemByIdQuery request, CancellationToken cancellationToken)
        {
            var newsItem = await _repo.GetByIdAsync(request.NewsId, cancellationToken);
            
            if (newsItem == null)
            {
                return null;
            }

            return _mapper.Map<NewsDto>(newsItem);
        }
    }
}