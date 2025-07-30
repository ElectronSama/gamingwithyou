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
    public class GetFixedServicesHandler : IRequestHandler<GetFixedServicesQuery, List<FixedServiceDto>>
    {
        private readonly IAsyncRepository<FixedService> _serviceRepository;
        private readonly IAsyncRepository<User> _userRepository;
        private readonly IAsyncRepository<Tag> _tagRepository;
        private readonly IMapper _mapper;

        public GetFixedServicesHandler(
            IAsyncRepository<FixedService> serviceRepository,
            IAsyncRepository<User> userRepository,
            IAsyncRepository<Tag> tagRepository,
            IMapper mapper)
        {
            _serviceRepository = serviceRepository;
            _userRepository = userRepository;
            _tagRepository = tagRepository;
            _mapper = mapper;
        }

        public async Task<List<FixedServiceDto>> Handle(GetFixedServicesQuery request, CancellationToken cancellationToken)
        {
            var services = await _serviceRepository.ListAsync(cancellationToken, s => s.User);
            
            var users = await _userRepository.ListAsync(cancellationToken, u => u.Tags);
            var allTags = await _tagRepository.ListAsync(cancellationToken);
            
            var userDict = users.ToDictionary(u => u.Id);
            var tagDict = allTags.ToDictionary(t => t.Id);
            
            foreach (var user in users)
            {
                foreach (var userTag in user.Tags)
                {
                    if (tagDict.TryGetValue(userTag.TagId, out var tag))
                    {
                        userTag.Tag = tag;
                    }
                }
            }
            
            foreach (var service in services)
            {
                if (userDict.TryGetValue(service.UserId, out var populatedUser))
                {
                    service.User = populatedUser;
                }
            }
            
            var filteredServices = services.AsQueryable();

            if (request.UserId != null)
            {
                filteredServices = filteredServices.Where(s => s.UserId == request.UserId);
            }

            if (!string.IsNullOrEmpty(request.Category))
            {
                filteredServices = filteredServices.Where(s => 
                    s.User.Tags.Any(ut => ut.Tag != null && ut.Tag.Name.Equals(request.Category, StringComparison.OrdinalIgnoreCase)));
            }

            var activeServices = filteredServices
                .Where(s => s.Status == ServiceStatus.Active)
                .OrderByDescending(s => s.CreatedAt)
                .ToList();

            return _mapper.Map<List<FixedServiceDto>>(activeServices);
        }
    }
}