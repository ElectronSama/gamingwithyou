using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class BookingHandler : IRequestHandler<BookingCommand, bool>
    {
        private readonly IAsyncRepository<User> _userrepo;
        private readonly IAsyncRepository<Booking> _bookingrepo;
        private readonly IEmailService _emailService;
        private readonly ILogger<BookingHandler> _logger;

        public BookingHandler(
            IAsyncRepository<User> userrepo,
            IAsyncRepository<Booking> bookingrepo,
            IEmailService emailService,
            ILogger<BookingHandler> logger)
        {
            _userrepo = userrepo;
            _bookingrepo = bookingrepo;
            _emailService = emailService;
            _logger = logger;
        }

        public async Task<bool> Handle(BookingCommand request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Processing booking command for Provider: {ProviderId}, Customer: {CustomerId}, Appointment: {AppointmentId}",
                request.providerId, request.customerId, request.appointmentId);

            var customer = (await _userrepo.ListAsync(cancellationToken, x=> x.IdentityUser)).FirstOrDefault(x => x.UserId == request.customerId);

            var provider = (await _userrepo.GetByIdAsync(request.providerId, cancellationToken, x => x.DailyAvailability, x => x.IdentityUser));

            if (provider == null || customer == null)
            {
                _logger.LogError("Provider or customer not found - Provider: {Provider}, Customer: {Customer}",
                    provider != null, customer != null);
                throw new InvalidOperationException("Provider or customer not found");
            }

            var appointment = provider.DailyAvailability.FirstOrDefault(x => x.Id == request.appointmentId);

            if (appointment == null)
            {
                _logger.LogError("Appointment {AppointmentId} not found for provider {ProviderId}",
                    request.appointmentId, request.providerId);
                throw new InvalidOperationException("Appointment doesnt exist at current user");
            }

            if (!appointment.IsAvailable)
            {
                _logger.LogWarning("Appointment {AppointmentId} is already taken", request.appointmentId);
                throw new Exception("Appointment is already taken");
            }

            var start = appointment.Date.Add(appointment.StartTime);

            var booking = new Booking(provider.Id, customer.Id, start, appointment.Duration, request.PaymentIntentId)
            {
                Amount = appointment.Price,  
                UserAvailabilityId = appointment.Id  
            };

            await _bookingrepo.AddAsync(booking);
            _logger.LogInformation("Booking {BookingId} created successfully", booking.Id);

            appointment.IsAvailable = false;
            await _userrepo.Update(provider);
            _logger.LogInformation("Appointment {AppointmentId} marked as unavailable", request.appointmentId);

            await SendBookingConfirmationEmails(provider, customer, booking, appointment);

            return true;
        }

        private async Task SendBookingConfirmationEmails(User provider, User customer, Booking booking, UserAvailability appointment)
        {
            _logger.LogInformation("Starting to send booking confirmation emails for booking {BookingId}", booking.Id);

            try
            {
                var providerEmail = provider.IdentityUser?.Email;
                var customerEmail = customer.IdentityUser?.Email;

                _logger.LogInformation("Email addresses - Provider: {ProviderEmail}, Customer: {CustomerEmail}",
                    providerEmail ?? "NULL", customerEmail ?? "NULL");

                var appointmentDateTime = appointment.Date.Add(appointment.StartTime);
                var endDateTime = appointmentDateTime.Add(appointment.Duration);

                var emailVariables = new Dictionary<string, string>
                {
                    { "provider_name", provider.Username },
                    { "customer_name", customer.Username },
                    { "appointment_date", appointmentDateTime.ToString("MMMM dd, yyyy") },
                    { "appointment_time", appointmentDateTime.ToString("HH:mm") },
                    { "appointment_end_time", endDateTime.ToString("HH:mm") },
                    { "duration", appointment.Duration.ToString(@"hh\:mm") },
                    { "price", (appointment.Price).ToString() },
                    { "booking_id", booking.Id.ToString() }
                };

                _logger.LogInformation("Email variables prepared for booking {BookingId}", booking.Id);

                bool providerEmailSent = false;
                if (!string.IsNullOrEmpty(providerEmail))
                {
                    try
                    {
                        _logger.LogInformation("Attempting to send email to provider {ProviderEmail} for booking {BookingId}",
                            providerEmail, booking.Id);

                        await _emailService.SendEmailAsync(
                            providerEmail,
                            "New Booking Received - Gaming Session",
                            7178607, 
                            emailVariables
                        );

                        providerEmailSent = true;
                        _logger.LogInformation("Successfully sent booking confirmation email to provider {ProviderEmail} for booking {BookingId}",
                            providerEmail, booking.Id);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to send booking confirmation email to provider {ProviderEmail} for booking {BookingId}: {Message}",
                            providerEmail, booking.Id, ex.Message);
                    }
                }
                else
                {
                    _logger.LogWarning("Provider email is null or empty for booking {BookingId}, skipping provider email", booking.Id);
                }

                bool customerEmailSent = false;
                if (!string.IsNullOrEmpty(customerEmail))
                {
                    try
                    {
                        _logger.LogInformation("Attempting to send email to customer {CustomerEmail} for booking {BookingId}",
                            customerEmail, booking.Id);

                        await _emailService.SendEmailAsync(
                            customerEmail,
                            "Booking Confirmation - Gaming Session",
                            7178601,
                            emailVariables
                        );

                        customerEmailSent = true;
                        _logger.LogInformation("Successfully sent booking confirmation email to customer {CustomerEmail} for booking {BookingId}",
                            customerEmail, booking.Id);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to send booking confirmation email to customer {CustomerEmail} for booking {BookingId}: {Message}",
                            customerEmail, booking.Id, ex.Message);
                    }
                }
                else
                {
                    _logger.LogWarning("Customer email is null or empty for booking {BookingId}, skipping customer email", booking.Id);
                }

                _logger.LogInformation("Email sending summary for booking {BookingId} - Provider email sent: {ProviderSent}, Customer email sent: {CustomerSent}",
                    booking.Id, providerEmailSent, customerEmailSent);

                if (!providerEmailSent && !customerEmailSent)
                {
                    _logger.LogWarning("No confirmation emails were sent for booking {BookingId}", booking.Id);
                }
                else if (!providerEmailSent || !customerEmailSent)
                {
                    _logger.LogWarning("Only partial email confirmation sent for booking {BookingId}", booking.Id);
                }
                else
                {
                    _logger.LogInformation("All confirmation emails sent successfully for booking {BookingId}", booking.Id);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error occurred while sending booking confirmation emails for booking {BookingId}: {Message}",
                    booking.Id, ex.Message);
            }
        }
    }
}