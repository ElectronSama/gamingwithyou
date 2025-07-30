using GamingWithMe.Application.Commands;
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
    public class ValidateBookingHandler : IRequestHandler<ValidateBookingCommand, bool>
    {
        private readonly IAsyncRepository<User> _userrepo;

        public ValidateBookingHandler(
            IAsyncRepository<User> userrepo)
        {
            _userrepo = userrepo;
        }
        public async Task<bool> Handle(ValidateBookingCommand request, CancellationToken cancellationToken)
        {
            var customer = (await _userrepo.ListAsync(cancellationToken)).FirstOrDefault(x=> x.UserId == request.CustomerId);


            var provider = (await _userrepo.GetByIdAsync(request.ProviderId, cancellationToken, x => x.DailyAvailability));

            if (provider == null || customer == null)
                throw new InvalidOperationException("Provider or customer not found");

            var appointment = provider.DailyAvailability.FirstOrDefault(x => x.Id == request.AppointmentId);

            if (appointment == null)
            {
                throw new InvalidOperationException("Appointment doesnt exist at current user");
            }

            if (!appointment.IsAvailable)
            {
                throw new Exception("Appointment is already taken");
            }

            return true;
        }
    }
}
