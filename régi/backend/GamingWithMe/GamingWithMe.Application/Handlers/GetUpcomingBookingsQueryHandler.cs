using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Application.Queries;
using GamingWithMe.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class GetUpcomingBookingsQueryHandler : IRequestHandler<GetUpcomingBookingsQuery, List<UpcomingBookingDto>>
    {
        private readonly IAsyncRepository<User> _userRepository;
        private readonly IAsyncRepository<Booking> _bookingRepository;
        private readonly ILogger<GetUpcomingBookingsQueryHandler> _logger;

        public GetUpcomingBookingsQueryHandler(
            IAsyncRepository<User> userRepository, 
            IAsyncRepository<Booking> bookingRepository,
            ILogger<GetUpcomingBookingsQueryHandler> logger)
        {
            _userRepository = userRepository;
            _bookingRepository = bookingRepository;
            _logger = logger;
        }

        public async Task<List<UpcomingBookingDto>> Handle(GetUpcomingBookingsQuery request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Processing GetUpcomingBookingsQuery for UserId: {UserId}", request.UserId);

            try
            {
                var user = (await _userRepository.ListAsync(cancellationToken)).FirstOrDefault(u => u.UserId == request.UserId);
                if (user == null)
                {
                    _logger.LogWarning("User not found for UserId: {UserId}", request.UserId);
                    return new List<UpcomingBookingDto>();
                }

                _logger.LogInformation("Found user {Username} (Id: {Id}) for UserId: {UserId}", 
                    user.Username, user.Id, request.UserId);

                var bookings = await _bookingRepository.ListAsync(cancellationToken, b => b.Provider, b => b.Customer);
                _logger.LogInformation("Retrieved {BookingCount} total bookings from repository", bookings.Count);

                var currentTime = DateTime.UtcNow;
                _logger.LogDebug("Current UTC time: {CurrentTime}", currentTime);

                var userBookings = bookings.Where(b => b.CustomerId == user.Id || b.ProviderId == user.Id).ToList();
                _logger.LogInformation("Found {UserBookingCount} bookings for user {UserId} (as customer or provider)", 
                    userBookings.Count, request.UserId);

                var upcomingBookings = userBookings
                    .Where(b => b.StartTime > currentTime)
                    .Select(b =>
                    {
                        var otherParty = b.CustomerId == user.Id ? b.Provider : b.Customer;
                        _logger.LogDebug("Processing booking {BookingId}: StartTime={StartTime}, OtherParty={OtherPartyUsername}", 
                            b.Id, b.StartTime, otherParty?.Username ?? "NULL");
                        
                        return new UpcomingBookingDto(
                            b.Id,
                            b.StartTime,
                            b.Duration,
                            otherParty.Username,
                            otherParty.AvatarUrl
                        );
                    })
                    .OrderBy(b => b.StartTime)
                    .ToList();

                _logger.LogInformation("Returning {UpcomingBookingCount} upcoming bookings for UserId: {UserId}", 
                    upcomingBookings.Count, request.UserId);

                if (_logger.IsEnabled(LogLevel.Debug))
                {
                    foreach (var booking in upcomingBookings)
                    {
                        _logger.LogDebug("Upcoming booking: Id={BookingId}, StartTime={StartTime}, OtherParty={OtherParty}", 
                            booking.BookingId, booking.StartTime, booking.OtherPartyUsername);
                    }
                }

                return upcomingBookings;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while processing GetUpcomingBookingsQuery for UserId: {UserId}. Error: {Message}", 
                    request.UserId, ex.Message);
                throw;
            }
        }
    }
}