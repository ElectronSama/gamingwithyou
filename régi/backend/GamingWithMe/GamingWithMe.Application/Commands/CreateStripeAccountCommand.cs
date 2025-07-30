using MediatR;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Commands
{
    public record CreateStripeAccountCommand(string userId) : IRequest<(AccountLink, Account)>;
}
