using GamingWithMe.Application.Dtos;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Commands
{
    public record BookingCommand(Guid providerId, string customerId, string PaymentIntentId, Guid appointmentId) : IRequest<bool>;
}
