using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class CreateServiceOrderHandler : IRequestHandler<CreateServiceOrderCommand, Guid>
    {
        private readonly IAsyncRepository<User> _userRepository;
        private readonly IAsyncRepository<FixedService> _serviceRepository;
        private readonly IAsyncRepository<ServiceOrder> _orderRepository;
        private readonly IEmailService _emailService;

        public CreateServiceOrderHandler(
            IAsyncRepository<User> userRepository,
            IAsyncRepository<FixedService> serviceRepository,
            IAsyncRepository<ServiceOrder> orderRepository,
            IEmailService emailService)
        {
            _userRepository = userRepository;
            _serviceRepository = serviceRepository;
            _orderRepository = orderRepository;
            _emailService = emailService;
        }

        public async Task<Guid> Handle(CreateServiceOrderCommand request, CancellationToken cancellationToken)
        {
            var customer = (await _userRepository.ListAsync(cancellationToken, x=> x.IdentityUser))
                .FirstOrDefault(u => u.UserId == request.CustomerId);

            if (customer == null)
                throw new InvalidOperationException("Customer not found");

            var service = await _serviceRepository.GetByIdAsync(request.OrderDto.ServiceId, cancellationToken, s => s.User, s => s.User.IdentityUser);

            if (service == null)
                throw new InvalidOperationException("Service not found");

            if (service.Status != ServiceStatus.Active)
                throw new InvalidOperationException("Service is not available");

            var order = new ServiceOrder(
                service.Id,
                customer.Id,
                service.UserId,
                request.PaymentIntentId,
                service.GetDeadlineInDays(),
                request.OrderDto.CustomerNotes
            );

            await _orderRepository.AddAsync(order, cancellationToken);

            await SendServiceOrderConfirmationEmails(service.User, customer, service, order);

            return order.Id;
        }

        private async Task SendServiceOrderConfirmationEmails(User provider, User customer, FixedService service, ServiceOrder order)
        {
            try
            {
                var providerEmail = provider.IdentityUser?.Email;
                var customerEmail = customer.IdentityUser?.Email;

                var emailVariables = new Dictionary<string, string>
                {
                    { "provider_name", provider.Username },
                    { "customer_name", customer.Username },
                    { "service_title", service.Title },
                    { "service_description", service.Description },
                    { "price", (service.Price).ToString() },
                    { "order_date", order.OrderDate.ToString("MMMM dd, yyyy") },
                    { "delivery_deadline", order.DeliveryDeadline.ToString("MMMM dd, yyyy") },
                    { "customer_notes", order.CustomerNotes ?? "No special notes" },
                    { "order_id", order.Id.ToString() }
                };

                if (!string.IsNullOrEmpty(providerEmail))
                {
                    await _emailService.SendEmailAsync(
                        providerEmail,
                        "New Service Order Received",
                        7178616, 
                        emailVariables
                    );
                }

                if (!string.IsNullOrEmpty(customerEmail))
                {
                    await _emailService.SendEmailAsync(
                        customerEmail,
                        "Service Order Confirmation",
                        7178615, 
                        emailVariables
                    );
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send service order confirmation emails: {ex.Message}");
            }
        }
    }
}