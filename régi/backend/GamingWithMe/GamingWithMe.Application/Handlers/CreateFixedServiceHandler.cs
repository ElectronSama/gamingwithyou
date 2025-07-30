using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Dtos;
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
    public class CreateFixedServiceHandler : IRequestHandler<CreateFixedServiceCommand, Guid>
    {
        private readonly IAsyncRepository<User> _userRepository;
        private readonly IAsyncRepository<FixedService> _serviceRepository;

        public CreateFixedServiceHandler(IAsyncRepository<User> userRepository, IAsyncRepository<FixedService> serviceRepository)
        {
            _userRepository = userRepository;
            _serviceRepository = serviceRepository;
        }

        public async Task<Guid> Handle(CreateFixedServiceCommand request, CancellationToken cancellationToken)
        {
            var user = (await _userRepository.ListAsync(cancellationToken, u => u.Tags))
                .FirstOrDefault(u => u.UserId == request.UserId);

            if (user == null)
                throw new InvalidOperationException("User not found");

            

            var service = new FixedService(
                request.ServiceDto.Title,
                request.ServiceDto.Description,
                request.ServiceDto.Price,
                request.ServiceDto.DeliveryDeadline,
                user.Id
            );

            await _serviceRepository.AddAsync(service, cancellationToken);
            return service.Id;
        }

    }
}