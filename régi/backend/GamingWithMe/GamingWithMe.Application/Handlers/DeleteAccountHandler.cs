using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class DeleteAccountHandler : IRequestHandler<DeleteAccountCommand, bool>
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IAsyncRepository<User> _userRepository;
        private readonly IAsyncRepository<Booking> _bookingRepository;

        public DeleteAccountHandler(
            UserManager<IdentityUser> userManager,
            IAsyncRepository<User> userRepository,
            IAsyncRepository<Booking> bookingRepository)
        {
            _userManager = userManager;
            _userRepository = userRepository;
            _bookingRepository = bookingRepository;
        }

        public async Task<bool> Handle(DeleteAccountCommand request, CancellationToken cancellationToken)
        {
            var identityUser = await _userManager.FindByIdAsync(request.UserId);
            if (identityUser == null)
            {
                return false;
            }

            var customUser = (await _userRepository.ListAsync(cancellationToken))
                .FirstOrDefault(u => u.UserId == request.UserId);

            if (customUser != null)
            {
                var allBookings = await _bookingRepository.ListAsync(cancellationToken);
                var hasPendingBookings = allBookings.Any(b =>
                    (b.ProviderId == customUser.Id || b.CustomerId == customUser.Id) &&
                    b.StartTime > DateTime.UtcNow);

                if (hasPendingBookings)
                {
                    throw new InvalidOperationException("Your account cannot be deleted because you have pending bookings. Please cancel or complete them first.");
                }

                var bookingsToDelete = allBookings
                    .Where(b => b.ProviderId == customUser.Id || b.CustomerId == customUser.Id);
                foreach (var booking in bookingsToDelete)
                {
                    await _bookingRepository.Delete(booking);
                }

                

                await _userRepository.Delete(customUser);
            }

            var result = await _userManager.DeleteAsync(identityUser);
            return result.Succeeded;
        }
    }
}