using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class DeleteGameFromGamerHandler : IRequestHandler<DeleteGameFromUserCommand, bool>
    {
        private readonly IAsyncRepository<User> _playerRepository;
        private readonly IAsyncRepository<Game> _gameRepository;

        public DeleteGameFromGamerHandler(IAsyncRepository<User> playerRepository, IAsyncRepository<Game> gameRepository)
        {
            _playerRepository = playerRepository;
            _gameRepository = gameRepository;
        }

        public async Task<bool> Handle(DeleteGameFromUserCommand request, CancellationToken cancellationToken)
        {
            var player = (await _playerRepository.ListAsync(cancellationToken)).FirstOrDefault(x=> x.UserId == request.userId);

            if (player is null)
                throw new InvalidOperationException("Player not found");

            var game = await _gameRepository.GetByIdAsync(request.gameId, cancellationToken);
            if (game == null) throw new InvalidOperationException("Game not found.");

            var entry = player.Games.FirstOrDefault(x=> x.Gamename == game.Name);

            if (entry != null)
            {
                player.Games.Remove(entry);
                await _playerRepository.Update(player);
                return true;
            }

            return false;
        }
    }
}
