using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class UpdateGameHandler : IRequestHandler<UpdateGameCommand, bool>
    {
        private readonly IAsyncRepository<Game> _gameRepository;

        public UpdateGameHandler(IAsyncRepository<Game> gameRepository)
        {
            _gameRepository = gameRepository;
        }

        public async Task<bool> Handle(UpdateGameCommand request, CancellationToken cancellationToken)
        {
            var game = await _gameRepository.GetByIdAsync(request.GameId, cancellationToken);

            if (game == null)
            {
                return false;
            }

            game.Name = request.GameDto.Name;
            game.Description = request.GameDto.Description;
            game.Slug = Domain.Common.SlugGenerator.From(request.GameDto.Name);

            await _gameRepository.Update(game);

            return true;
        }
    }
}