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
    public class GetBillingHistoryQueryHandler : IRequestHandler<GetBillingHistoryQuery, List<BillingRecordDto>>
    {
        private readonly IAsyncRepository<User> _userRepository;
        private readonly IAsyncRepository<Booking> _bookingRepository;
        private readonly IAsyncRepository<ServiceOrder> _serviceOrderRepository;
        private readonly ILogger<GetBillingHistoryQueryHandler> _logger;

        public GetBillingHistoryQueryHandler(
            IAsyncRepository<User> userRepository, 
            IAsyncRepository<Booking> bookingRepository,
            IAsyncRepository<ServiceOrder> serviceOrderRepository,
            ILogger<GetBillingHistoryQueryHandler> logger)
        {
            _userRepository = userRepository;
            _bookingRepository = bookingRepository;
            _serviceOrderRepository = serviceOrderRepository;
            _logger = logger;
        }

        public async Task<List<BillingRecordDto>> Handle(GetBillingHistoryQuery request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Processing GetBillingHistoryQuery for UserId: {UserId}", request.UserId);

            try
            {
                var user = (await _userRepository.ListAsync(cancellationToken)).FirstOrDefault(u => u.UserId == request.UserId);
                if (user == null)
                {
                    _logger.LogWarning("User not found for UserId: {UserId}", request.UserId);
                    return new List<BillingRecordDto>();
                }

                _logger.LogInformation("Found user {Username} (Id: {Id}) for UserId: {UserId}", 
                    user.Username, user.Id, request.UserId);

                var billingHistory = new List<BillingRecordDto>();

                _logger.LogDebug("Retrieving bookings from repository");
                var bookings = await _bookingRepository.ListAsync(cancellationToken, b => b.Provider, b => b.Customer);
                _logger.LogInformation("Retrieved {BookingCount} total bookings from repository", bookings.Count);

                var paidBookings = bookings.Where(b => b.CustomerId == user.Id).ToList();
                _logger.LogInformation("Found {PaidBookingCount} bookings where user was the customer (ALL - past, present, future)", paidBookings.Count);

                foreach (var booking in paidBookings)
                {
                    _logger.LogDebug("Processing paid booking {BookingId}: Amount={Amount}, Provider={ProviderUsername}, StartTime={StartTime}", 
                        booking.Id, booking.Amount, booking.Provider?.Username ?? "NULL", booking.StartTime);

                    if (booking.Provider == null)
                    {
                        _logger.LogWarning("Booking {BookingId} has null Provider, skipping", booking.Id);
                        continue;
                    }

                    billingHistory.Add(new BillingRecordDto(
                        booking.Id,
                        booking.StartTime,
                        booking.Amount,
                        "Paid",
                        booking.Provider.Username,
                        booking.Provider.AvatarUrl
                    ));
                }

                var receivedBookings = bookings.Where(b => b.ProviderId == user.Id).ToList();
                _logger.LogInformation("Found {ReceivedBookingCount} bookings where user was the provider (ALL - past, present, future)", receivedBookings.Count);

                foreach (var booking in receivedBookings)
                {
                    _logger.LogDebug("Processing received booking {BookingId}: Amount={Amount}, Customer={CustomerUsername}, StartTime={StartTime}", 
                        booking.Id, booking.Amount, booking.Customer?.Username ?? "NULL", booking.StartTime);

                    if (booking.Customer == null)
                    {
                        _logger.LogWarning("Booking {BookingId} has null Customer, skipping", booking.Id);
                        continue;
                    }

                    billingHistory.Add(new BillingRecordDto(
                        booking.Id,
                        booking.StartTime,
                        booking.Amount,
                        "Received",
                        booking.Customer.Username,
                        booking.Customer.AvatarUrl
                    ));
                }

                _logger.LogDebug("Retrieving service orders from repository");
                var serviceOrders = await _serviceOrderRepository.ListAsync(cancellationToken, 
                    so => so.Service, so => so.Customer, so => so.Provider);
                _logger.LogInformation("Retrieved {ServiceOrderCount} total service orders from repository", serviceOrders.Count);

                if (_logger.IsEnabled(LogLevel.Debug))
                {
                    foreach (var order in serviceOrders.Take(5)) 
                    {
                        _logger.LogDebug("Service order {OrderId}: Status={Status}, OrderDate={OrderDate}, CustomerId={CustomerId}, ProviderId={ProviderId}", 
                            order.Id, order.Status, order.OrderDate, order.CustomerId, order.ProviderId);
                    }
                }

                var paidOrders = serviceOrders.Where(so => so.CustomerId == user.Id).ToList();
                _logger.LogInformation("Found {PaidOrderCount} service orders where user was the customer (ALL statuses)", paidOrders.Count);

                foreach (var order in paidOrders)
                {
                    _logger.LogDebug("Processing paid service order {OrderId}: Service.Price={ServicePrice}, Provider={ProviderUsername}, OrderDate={OrderDate}, Status={Status}", 
                        order.Id, order.Service?.Price ?? 0, order.Provider?.Username ?? "NULL", order.OrderDate, order.Status);

                    if (order.Service == null)
                    {
                        _logger.LogWarning("Service order {OrderId} has null Service, skipping", order.Id);
                        continue;
                    }

                    if (order.Provider == null)
                    {
                        _logger.LogWarning("Service order {OrderId} has null Provider, skipping", order.Id);
                        continue;
                    }

                    billingHistory.Add(new BillingRecordDto(
                        order.Id,
                        order.OrderDate,
                        order.Service.Price,
                        "Paid",
                        order.Provider.Username,
                        order.Provider.AvatarUrl
                    ));
                }

                var receivedOrders = serviceOrders.Where(so => so.ProviderId == user.Id).ToList();
                _logger.LogInformation("Found {ReceivedOrderCount} service orders where user was the provider (ALL statuses)", receivedOrders.Count);

                foreach (var order in receivedOrders)
                {
                    _logger.LogDebug("Processing received service order {OrderId}: Service.Price={ServicePrice}, Customer={CustomerUsername}, OrderDate={OrderDate}, Status={Status}", 
                        order.Id, order.Service?.Price ?? 0, order.Customer?.Username ?? "NULL", order.OrderDate, order.Status);

                    if (order.Service == null)
                    {
                        _logger.LogWarning("Service order {OrderId} has null Service, skipping", order.Id);
                        continue;
                    }

                    if (order.Customer == null)
                    {
                        _logger.LogWarning("Service order {OrderId} has null Customer, skipping", order.Id);
                        continue;
                    }

                    billingHistory.Add(new BillingRecordDto(
                        order.Id,
                        order.OrderDate,
                        order.Service.Price,
                        "Received",
                        order.Customer.Username,
                        order.Customer.AvatarUrl
                    ));
                }

                var sortedBillingHistory = billingHistory.OrderByDescending(b => b.TransactionDate).ToList();
                _logger.LogInformation("Returning {BillingRecordCount} billing records for UserId: {UserId} (ALL transactions regardless of status/timing)", 
                    sortedBillingHistory.Count, request.UserId);

                if (_logger.IsEnabled(LogLevel.Debug))
                {
                    foreach (var record in sortedBillingHistory.Take(5)) 
                    {
                        _logger.LogDebug("Billing record: BookingId={BookingId}, TransactionDate={TransactionDate}, Amount={Amount}, Type={Type}, OtherParty={OtherParty}", 
                            record.BookingId, record.TransactionDate, record.Amount, record.TransactionType, record.OtherPartyUsername);
                    }
                }

                return sortedBillingHistory;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while processing GetBillingHistoryQuery for UserId: {UserId}. Error: {Message}", 
                    request.UserId, ex.Message);
                throw;
            }
        }
    }
}