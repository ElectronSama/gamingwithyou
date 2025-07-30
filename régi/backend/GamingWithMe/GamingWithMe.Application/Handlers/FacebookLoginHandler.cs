using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Application.Services;
using GamingWithMe.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class FacebookLoginHandler : IRequestHandler<FacebookLoginCommand, UserDto>
    {
        private readonly IAsyncRepository<User> _userRepo;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IMediator _mediator;

        public FacebookLoginHandler(IAsyncRepository<User> userRepo, UserManager<IdentityUser> userManager, IMediator mediator)
        {
            _userRepo = userRepo;
            _userManager = userManager;
            _mediator = mediator;
        }

        public async Task<UserDto> Handle(FacebookLoginCommand request, CancellationToken cancellationToken)
        {
            var identityUser = await _userManager.FindByEmailAsync(request.Email);
            
            if (identityUser != null)
            {
                var existingUser = (await _userRepo.ListAsync(cancellationToken))
                    .FirstOrDefault(u => u.UserId == identityUser.Id);

                if (existingUser != null)
                {
                    if (string.IsNullOrEmpty(existingUser.FacebookId) && !string.IsNullOrEmpty(request.FacebookId))
                    {
                        existingUser.FacebookId = request.FacebookId;
                        await _userRepo.Update(existingUser);
                    }

                    return new UserDto(identityUser.Email, existingUser.GoogleId, existingUser.FacebookId, request.FullName);
                }
            }

            var username = UsernameValidationService.GenerateUsernameFromEmail(request.Email);
            
            var existingUsernames = (await _userRepo.ListAsync(cancellationToken))
                .Select(u => u.Username)
                .ToList();
            
            username = UsernameValidationService.EnsureUniqueUsername(username, existingUsernames);

            var registerDto = new RegisterDto(
                email: request.Email,
                password: null,
                username: username,
                googleId: null,
                facebookId: request.FacebookId
            );

            try
            {
                var userId = await _mediator.Send(new RegisterProfileCommand(registerDto), cancellationToken);
                
                var newUser = (await _userRepo.ListAsync(cancellationToken))
                    .FirstOrDefault(u => u.UserId == userId);
                
                if (newUser != null)
                {
                    newUser.FacebookId = request.FacebookId;
                    await _userRepo.Update(newUser);
                }

                return new UserDto(request.Email, null, request.FacebookId, request.FullName);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to create user account: {ex.Message}", ex);
            }
        }
    }
}