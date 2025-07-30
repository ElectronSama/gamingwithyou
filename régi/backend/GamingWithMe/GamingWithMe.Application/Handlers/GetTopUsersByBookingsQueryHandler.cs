using AutoMapper;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Application.Queries;
using GamingWithMe.Domain.Entities;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class GetTopUsersByBookingsQueryHandler : IRequestHandler<GetTopUsersByBookingsQuery, List<ProfileDto>>
    {
        private readonly IAsyncRepository<User> _userRepo;
        private readonly IMapper _mapper;

        public GetTopUsersByBookingsQueryHandler(IAsyncRepository<User> userRepo, IMapper mapper)
        {
            _userRepo = userRepo;
            _mapper = mapper;
        }

        public async Task<List<ProfileDto>> Handle(GetTopUsersByBookingsQuery request, CancellationToken cancellationToken)
        {
            var users = await _userRepo.ListAsync(cancellationToken, u => u.Bookings, u => u.Languages, u => u.Games, u => u.Tags);

            var topUsers = users
                .Where(u => !string.IsNullOrEmpty(u.StripeAccount))
                .OrderByDescending(u => u.Bookings.Count)
                .Take(8)
                .ToList();

            return _mapper.Map<List<ProfileDto>>(topUsers);
        }
    }
}