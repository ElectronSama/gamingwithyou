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
    public class DeleteDailyAvailabilityHandler : IRequestHandler<DeleteDailyAvailabilityCommand, bool>
    {
        private readonly IAsyncRepository<User> _userRepo;
        private readonly IAsyncRepository<UserAvailability> _availabilityRepo;

        public DeleteDailyAvailabilityHandler(
            IAsyncRepository<User> userRepo,
            IAsyncRepository<UserAvailability> availabilityRepo)
        {
            _userRepo = userRepo;
            _availabilityRepo = availabilityRepo;
        }

        public async Task<bool> Handle(DeleteDailyAvailabilityCommand request, CancellationToken cancellationToken)
        {
            var user = (await _userRepo.ListAsync(cancellationToken))
                .FirstOrDefault(x => x.UserId == request.UserId);

            if (user == null)
            {
                throw new Exception("User not found");
            }

            if (!TimeSpan.TryParse(request.StartTime, out var startTime))
                throw new FormatException($"Invalid start time format: {request.StartTime}");

            var existingEntry = (await _availabilityRepo.ListAsync(cancellationToken))
                .FirstOrDefault(a => a.UserId == user.Id && 
                                   a.Date.Date == request.Date.Date && 
                                   a.StartTime == startTime);

            if (existingEntry == null)
            {
                return true; 
            }

            await _availabilityRepo.Delete(existingEntry);

            return true;
        }
    }
}