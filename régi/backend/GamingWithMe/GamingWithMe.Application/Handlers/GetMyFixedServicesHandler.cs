using AutoMapper;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Application.Queries;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class GetMyFixedServicesHandler : IRequestHandler<GetMyFixedServicesQuery, List<FixedServiceDto>>
    {
        private readonly IAsyncRepository<FixedService> _serviceRepository;
        private readonly IAsyncRepository<User> _userRepository;
        private readonly IMapper _mapper;

        public GetMyFixedServicesHandler(
            IAsyncRepository<FixedService> serviceRepository,
            IAsyncRepository<User> userRepository,
            IMapper mapper)
        {
            _serviceRepository = serviceRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<List<FixedServiceDto>> Handle(GetMyFixedServicesQuery request, CancellationToken cancellationToken)
        {
            var user = (await _userRepository.ListAsync(cancellationToken))
                .FirstOrDefault(u => u.UserId == request.UserId);

            if (user == null)
                throw new InvalidOperationException("User not found");

            var services = await _serviceRepository.ListAsync(cancellationToken, s => s.User);
            
            var userServices = services
                .Where(s => s.UserId == user.Id)
                .OrderByDescending(s => s.CreatedAt)
                .ToList();

            return _mapper.Map<List<FixedServiceDto>>(userServices);
        }
    }
}