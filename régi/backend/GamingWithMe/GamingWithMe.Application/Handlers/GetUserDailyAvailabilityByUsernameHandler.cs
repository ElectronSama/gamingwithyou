using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Application.Queries;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class GetUserDailyAvailabilityByUsernameHandler 
        : IRequestHandler<GetUserDailyAvailabilityByUsernameQuery, IEnumerable<AvailabilitySlotDto>>
    {
        private readonly IAsyncRepository<User> _userRepo;
        private readonly IAsyncRepository<UserAvailability> _availabilityRepo;

        public GetUserDailyAvailabilityByUsernameHandler(
            IAsyncRepository<User> userRepo,
            IAsyncRepository<UserAvailability> availabilityRepo)
        {
            _userRepo = userRepo;
            _availabilityRepo = availabilityRepo;
        }

        public async Task<IEnumerable<AvailabilitySlotDto>> Handle(
            GetUserDailyAvailabilityByUsernameQuery request, 
            CancellationToken cancellationToken)
        {
            var user = (await _userRepo.ListAsync(cancellationToken))
                .FirstOrDefault(x => x.Username == request.Username);

            if (user == null)
            {
                throw new Exception("User not found");
            }

            var slots = (await _availabilityRepo.ListAsync(cancellationToken))
                .Where(a => a.UserId == user.Id && a.Date.Date == request.Date.Date)
                .OrderBy(a => a.StartTime)
                .ToList();

            return slots.Select(slot => new AvailabilitySlotDto(
                slot.Id,
                slot.Date,
                slot.StartTime.ToString(@"hh\:mm"),
                slot.StartTime.Add(slot.Duration).ToString(@"hh\:mm"),
                slot.IsAvailable,
                slot.Price
            )).ToList();
        }
    }
}