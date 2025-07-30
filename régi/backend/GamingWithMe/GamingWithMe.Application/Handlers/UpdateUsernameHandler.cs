using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Application.Services;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class UpdateUsernameHandler : IRequestHandler<UpdateUsernameCommand, bool>
    {
        private readonly IAsyncRepository<User> _userRepository;

        public UpdateUsernameHandler(IAsyncRepository<User> userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<bool> Handle(UpdateUsernameCommand request, CancellationToken cancellationToken)
        {
            var user = (await _userRepository.ListAsync(cancellationToken))
                .FirstOrDefault(u => u.UserId == request.UserId);

            if (user == null)
            {
                throw new InvalidOperationException("User not found.");
            }

            UsernameValidationService.ValidateUsername(request.NewUsername);

            var existingUser = (await _userRepository.ListAsync(cancellationToken))
                .FirstOrDefault(u => string.Equals(u.Username, request.NewUsername, StringComparison.OrdinalIgnoreCase) && u.Id != user.Id);

            if (existingUser != null)
            {
                throw new InvalidOperationException("This username is already taken. Please choose another one.");
            }

            user.Username = request.NewUsername;
            await _userRepository.Update(user);

            return true;
        }
    }
}