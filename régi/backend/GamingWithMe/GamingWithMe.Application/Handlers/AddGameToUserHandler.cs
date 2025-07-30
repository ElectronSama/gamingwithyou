using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class AddGameToUserHandler : IRequestHandler<AddGameToUserCommand, bool>
    {
        private readonly IAsyncRepository<User> _playerRepository;
        private readonly IAsyncRepository<Game> _gameRepository;

        public AddGameToUserHandler(IAsyncRepository<User> playerRepository, IAsyncRepository<Game> gameRepository)
        {
            _playerRepository = playerRepository;
            _gameRepository = gameRepository;
        }

        public async Task<bool> Handle(AddGameToUserCommand request, CancellationToken cancellationToken)
        {
            var player = (await _playerRepository.ListAsync(cancellationToken)).FirstOrDefault(x=> x.UserId == request.userId);

            if (player is null)
                throw new InvalidOperationException("Player not found");

            var game = await _gameRepository.GetByIdAsync(request.gameId, cancellationToken);
            if(game == null) throw new InvalidOperationException("Game not found.");

            var alreadyHasGame = player.Games.Any(x=> x.Gamename == game.Name);

            if (!alreadyHasGame)
            {
                player.Games.Add(new UserGame { Gamename = game.Name, PlayerId = player.Id});
            }

            await _playerRepository.Update(player);

            return true;
        }
    }
}
