using AutoMapper;
using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class CreateNewsItemHandler : IRequestHandler<CreateNewsItemCommand, NewsDto>
    {
        private readonly IAsyncRepository<GameNews> _repo;
        private readonly IAsyncRepository<Game> _gameRepo;
        private readonly IMapper _mapper;

        public CreateNewsItemHandler(
            IAsyncRepository<GameNews> repo, 
            IAsyncRepository<Game> gameRepo,
            IMapper mapper)
        {
            _repo = repo;
            _gameRepo = gameRepo;
            _mapper = mapper;
        }

        public async Task<NewsDto> Handle(CreateNewsItemCommand request, CancellationToken cancellationToken)
        {
            var game = await _gameRepo.GetByIdAsync(request.GameId, cancellationToken);
            if (game == null)
            {
                throw new ApplicationException($"Game with ID {request.GameId} not found");
            }

            var newsItem = new GameNews(request.Title, request.Content, request.GameId);
            
            await _repo.AddAsync(newsItem, cancellationToken);
            
            newsItem.Game = game;

            return _mapper.Map<NewsDto>(newsItem);
        }
    }
}