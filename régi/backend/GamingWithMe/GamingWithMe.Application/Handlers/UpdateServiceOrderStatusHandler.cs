using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Interfaces;
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
    public class UpdateServiceOrderStatusHandler : IRequestHandler<UpdateServiceOrderStatusCommand, bool>
    {
        private readonly IAsyncRepository<ServiceOrder> _orderRepository;
        private readonly IAsyncRepository<User> _userRepository;
        private readonly IEmailService _emailService;
        private readonly ILogger<UpdateServiceOrderStatusHandler> _logger;

        public UpdateServiceOrderStatusHandler(
            IAsyncRepository<ServiceOrder> orderRepository,
            IAsyncRepository<User> userRepository,
            IEmailService emailService,
            ILogger<UpdateServiceOrderStatusHandler> logger)
        {
            _orderRepository = orderRepository;
            _userRepository = userRepository;
            _emailService = emailService;
            _logger = logger;
        }

        public async Task<bool> Handle(UpdateServiceOrderStatusCommand request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Processing service order status update for Order: {OrderId}, Provider: {ProviderId}, Status: {Status}",
                request.OrderId, request.ProviderId, request.Status);

            var order = await _orderRepository.GetByIdAsync(request.OrderId, cancellationToken, 
                o => o.Service, o => o.Customer, o => o.Provider, o => o.Customer.IdentityUser, o => o.Provider.IdentityUser);

            if (order == null)
            {
                _logger.LogError("Service order {OrderId} not found", request.OrderId);
                throw new InvalidOperationException("Service order not found");
            }

            if (order.Provider.UserId != request.ProviderId)
            {
                _logger.LogError("User {ProviderId} is not authorized to update order {OrderId}", request.ProviderId, request.OrderId);
                throw new InvalidOperationException("You are not authorized to update this service order");
            }

            ValidateStatusTransition(order.Status, request.Status);

            var previousStatus = order.Status;
            order.Status = request.Status;
            order.ProviderNotes = request.ProviderNotes;

            if (request.Status == OrderStatus.Completed && order.CompletedDate == null)
            {
                order.CompletedDate = DateTime.UtcNow;
                _logger.LogInformation("Setting completed date for order {OrderId} to {CompletedDate}", 
                    request.OrderId, order.CompletedDate);
            }

            await _orderRepository.Update(order);
            _logger.LogInformation("Service order {OrderId} status updated from {PreviousStatus} to {NewStatus}", 
                request.OrderId, previousStatus, request.Status);

            await SendStatusUpdateEmails(order, previousStatus);

            return true;
        }

        private void ValidateStatusTransition(OrderStatus currentStatus, OrderStatus newStatus)
        {
            var allowedTransitions = new Dictionary<OrderStatus, OrderStatus[]>
            {
                { OrderStatus.Pending, new[] { OrderStatus.InProgress, OrderStatus.Cancelled } },
                { OrderStatus.InProgress, new[] { OrderStatus.Completed, OrderStatus.Cancelled } },
                { OrderStatus.Completed, new OrderStatus[0] },
                { OrderStatus.Cancelled, new OrderStatus[0] }, 
                { OrderStatus.Refunded, new OrderStatus[0] }
            };

            if (!allowedTransitions.ContainsKey(currentStatus))
            {
                throw new InvalidOperationException($"Invalid current status: {currentStatus}");
            }

            if (!allowedTransitions[currentStatus].Contains(newStatus))
            {
                throw new InvalidOperationException(
                    $"Cannot transition from {currentStatus} to {newStatus}. " +
                    $"Allowed transitions: {string.Join(", ", allowedTransitions[currentStatus])}");
            }
        }

        private async Task SendStatusUpdateEmails(ServiceOrder order, OrderStatus previousStatus)
        {
            _logger.LogInformation("Sending status update emails for order {OrderId}", order.Id);

            try
            {
                var customerEmail = order.Customer?.IdentityUser?.Email;
                var providerEmail = order.Provider?.IdentityUser?.Email;

                if (string.IsNullOrEmpty(customerEmail))
                {
                    _logger.LogWarning("Customer email is null or empty for order {OrderId}, skipping customer email", order.Id);
                    return;
                }

                var statusMessage = order.Status switch
                {
                    OrderStatus.InProgress => "Your service order is now in progress",
                    OrderStatus.Completed => "Your service order has been completed",
                    OrderStatus.Cancelled => "Your service order has been cancelled",
                    _ => $"Your service order status has been updated to {order.Status}"
                };

                var emailVariables = new Dictionary<string, string>
                {
                    { "customer_name", order.Customer.Username },
                    { "provider_name", order.Provider.Username },
                    { "service_title", order.Service.Title },
                    { "order_id", order.Id.ToString() },
                    { "status_message", statusMessage },
                    { "previous_status", previousStatus.ToString() },
                    { "new_status", order.Status.ToString() },
                    { "provider_notes", order.ProviderNotes ?? "No additional notes" },
                    { "order_date", order.OrderDate.ToString("MMMM dd, yyyy") },
                    { "delivery_deadline", order.DeliveryDeadline.ToString("MMMM dd, yyyy") },
                    { "completed_date", order.CompletedDate?.ToString("MMMM dd, yyyy HH:mm") ?? "Not completed" }
                };

                var subject = order.Status switch
                {
                    OrderStatus.InProgress => "Service Order In Progress",
                    OrderStatus.Completed => "Service Order Completed",
                    OrderStatus.Cancelled => "Service Order Cancelled",
                    _ => "Service Order Status Update"
                };

                var templateId = order.Status switch
                {
                    OrderStatus.Completed => 7178620, 
                    OrderStatus.Cancelled => 7178621,
                    _ => 7178619 
                };

                //await _emailService.SendEmailAsync(
                //    customerEmail,
                //    $"{subject} - {order.Service.Title}",
                //    templateId,
                //    emailVariables
                //);

                _logger.LogInformation("Successfully sent status update email to customer {CustomerEmail} for order {OrderId}",
                    customerEmail, order.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send status update email for order {OrderId}: {Message}",
                    order.Id, ex.Message);
            }
        }
    }
}