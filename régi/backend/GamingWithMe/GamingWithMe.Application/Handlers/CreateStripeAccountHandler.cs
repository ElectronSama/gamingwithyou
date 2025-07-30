using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class CreateStripeAccountHandler : IRequestHandler<CreateStripeAccountCommand, (AccountLink, Account)>
    {
        private readonly IAsyncRepository<IdentityUser> _identityRepo;
        private readonly IAsyncRepository<User> _userRepo;
        private readonly AccountService _accountService;
        private readonly AccountLinkService _accountLinkService;

        public CreateStripeAccountHandler(IAsyncRepository<IdentityUser> identityRepo, IAsyncRepository<User> userRepo, AccountService accountService, AccountLinkService accountLinkService)
        {
            _identityRepo = identityRepo;
            _userRepo = userRepo;
            _accountService = accountService;
            _accountLinkService = accountLinkService;
        }

        public async Task<(AccountLink, Account)> Handle(CreateStripeAccountCommand request, CancellationToken cancellationToken)
        {


            var identityUser = (await _identityRepo.ListAsync()).FirstOrDefault(x => x.Id == request.userId);
            var notIdentityUser = (await _userRepo.ListAsync()).FirstOrDefault(x => x.UserId == request.userId);

            if (identityUser == null || notIdentityUser == null)
            {
                throw new InvalidOperationException("User not found in handler");
            }


            var accountOptions = new AccountCreateOptions
            {
                Type = "express",
                Email = identityUser.Email,
                Capabilities = new AccountCapabilitiesOptions
                {
                    CardPayments = new AccountCapabilitiesCardPaymentsOptions { Requested = true },
                    Transfers = new AccountCapabilitiesTransfersOptions { Requested = true },
                }
            };

            var account = await _accountService.CreateAsync(accountOptions);

            notIdentityUser.StripeAccount = account.Id;
            await _userRepo.Update(notIdentityUser);

            var link = await _accountLinkService.CreateAsync(new AccountLinkCreateOptions
            {
                Account = account.Id,
                RefreshUrl = "http://localhost:5173/refresh",
                ReturnUrl = "http://localhost:5173/complete",
                Type = "account_onboarding",
            });

            return (link,account);
        }
    }
}
