using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Dtos
{
    public record BookingPaymentDto
    (
         Guid ProviderId,
         Guid CustomerId,
         string From,
         string Duration,
         string ConnectedAccountId,
         string priceId
    );

}
