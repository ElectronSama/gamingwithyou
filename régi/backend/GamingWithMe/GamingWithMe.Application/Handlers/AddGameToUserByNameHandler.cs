using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class AddGameToUserByNameHandler : IRequestHandler<AddGameToUserByNameCommand, bool>
    {
        private readonly IAsyncRepository<User> _userRepo;
        private readonly IAsyncRepository<Game> _gameRepo;

        public AddGameToUserByNameHandler(
            IAsyncRepository<User> userRepo,
            IAsyncRepository<Game> gameRepo)
        {
            _userRepo = userRepo;
            _gameRepo = gameRepo;
        }

        public async Task<bool> Handle(AddGameToUserByNameCommand request, CancellationToken cancellationToken)
        {
            var userList = await _userRepo.ListAsync(cancellationToken);
            var userFromList = userList.FirstOrDefault(x => x.UserId == request.UserId);

            if (userFromList is null)
                throw new InvalidOperationException("User not found");

            var user = await _userRepo.GetByIdAsync(userFromList.Id, cancellationToken, x => x.Games);

            if (user is null)
                throw new InvalidOperationException("User not found");


            var alreadyHasGame = user.Games.Any(x => x.Gamename == request.GameName);

            if (!alreadyHasGame)
            {
                user.Games.Add(new UserGame
                {
                    Gamename = request.GameName,
                    PlayerId = user.Id
                });
                
                await _userRepo.Update(user);
                return true;
            }

            return false; 
        }
    }
}