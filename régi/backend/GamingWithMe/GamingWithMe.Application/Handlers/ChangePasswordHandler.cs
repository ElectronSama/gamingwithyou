using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class ChangePasswordHandler : IRequestHandler<ChangePasswordCommand, bool>
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IAsyncRepository<User> _userRepository;

        public ChangePasswordHandler(UserManager<IdentityUser> userManager, IAsyncRepository<User> userRepository)
        {
            _userManager = userManager;
            _userRepository = userRepository;
        }

        public async Task<bool> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
        {
            var identityUser = await _userManager.FindByIdAsync(request.UserId);
            if (identityUser == null)
            {
                throw new InvalidOperationException("User not found.");
            }

            var hasPassword = await _userManager.HasPasswordAsync(identityUser);
            if (!hasPassword)
            {
                throw new InvalidOperationException("This account uses external authentication and doesn't have a password.");
            }

            ValidatePassword(request.NewPassword);

            var result = await _userManager.ChangePasswordAsync(identityUser, request.CurrentPassword, request.NewPassword);

            if (!result.Succeeded)
            {
                var errorMessages = result.Errors.Select(e => e.Description);
                throw new InvalidOperationException(string.Join("; ", errorMessages));
            }

            return true;
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