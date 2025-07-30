using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Application.Services;
using GamingWithMe.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class RegisterProfileHandler : IRequestHandler<RegisterProfileCommand, string>
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IAsyncRepository<User> _userRepo;
        private readonly IEmailService _emailService;

        public RegisterProfileHandler(UserManager<IdentityUser> userManager, IAsyncRepository<User> regularRepo, IEmailService emailService)
        {
            _userManager = userManager;
            _userRepo = regularRepo;
            _emailService = emailService;
        }

        public async Task<string> Handle(RegisterProfileCommand request, CancellationToken cancellationToken)
        {
            var dto = request.RegisterDto;

            var existingIdentityUser = await _userManager.FindByEmailAsync(dto.email);
            if (existingIdentityUser != null)
            {
                throw new InvalidOperationException("An account with this email already exists.");
            }

            UsernameValidationService.ValidateUsername(dto.username);

            var existingCustomUser = (await _userRepo.ListAsync(cancellationToken))
                .FirstOrDefault(u => string.Equals(u.Username, dto.username, StringComparison.OrdinalIgnoreCase));
            if (existingCustomUser != null)
            {
                throw new InvalidOperationException("This username is already taken. Please choose another one.");
            }

            var user = new IdentityUser
            {
                UserName = dto.email,
                Email = dto.email,
            };

            IdentityResult result;

            if (!string.IsNullOrWhiteSpace(dto.password))
            {
                ValidatePassword(dto.password);
                result = await _userManager.CreateAsync(user, dto.password);
            }
            else
            {
                result = await _userManager.CreateAsync(user);
            }

            if (!result.Succeeded) {
                var errorMessages = result.Errors.Select(e => e.Description);
                throw new InvalidOperationException(string.Join("; ", errorMessages));
            }

            await _userRepo.AddAsync(new User(user.Id, dto.username));

            return user.Id;
        }

        private void ValidatePassword(string password)
        {
            if (password.Length < 6)
                throw new InvalidOperationException("Password must be at least 6 characters long.");
            if (!Regex.IsMatch(password, @"[A-Z]"))
                throw new InvalidOperationException("Password must contain at least one uppercase letter.");
            if (!Regex.IsMatch(password, @"[a-z]"))
                throw new InvalidOperationException("Password must contain at least one lowercase letter.");
            if (!Regex.IsMatch(password, @"\d"))
                throw new InvalidOperationException("Password must contain at least one number.");
            if (!Regex.IsMatch(password, @"[\W_]")) // \W is any non-word character
                throw new InvalidOperationException("Password must contain at least one special character.");
        }
    }
}
