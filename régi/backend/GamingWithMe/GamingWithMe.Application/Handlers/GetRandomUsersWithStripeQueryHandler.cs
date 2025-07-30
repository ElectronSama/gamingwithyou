using AutoMapper;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Application.Queries;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class GetRandomUsersWithStripeQueryHandler : IRequestHandler<GetRandomUsersWithStripeQuery, List<ProfileDto>>
    {
        private readonly IAsyncRepository<User> _userRepo;
        private readonly IMapper _mapper;

        public GetRandomUsersWithStripeQueryHandler(IAsyncRepository<User> userRepo, IMapper mapper)
        {
            _userRepo = userRepo;
            _mapper = mapper;
        }

        public async Task<List<ProfileDto>> Handle(GetRandomUsersWithStripeQuery request, CancellationToken cancellationToken)
        {
            var users = await _userRepo.ListAsync(cancellationToken, u => u.Languages, u => u.Games, u => u.Tags, u => u.DailyAvailability);

            var usersWithStripeAndAvailability = users
                .Where(u => !string.IsNullOrEmpty(u.StripeAccount) &&
                            u.DailyAvailability.Any(a => a.Date.Date == DateTime.UtcNow.Date))
                .OrderBy(u => Guid.NewGuid())
                .Take(8)
                .ToList();

            return _mapper.Map<List<ProfileDto>>(usersWithStripeAndAvailability);
        }
    }
}