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
    public class DeleteFixedServiceHandler : IRequestHandler<DeleteFixedServiceCommand, bool>
    {
        private readonly IAsyncRepository<FixedService> _serviceRepository;
        private readonly IAsyncRepository<User> _userRepository;

        public DeleteFixedServiceHandler(IAsyncRepository<FixedService> serviceRepository, IAsyncRepository<User> userRepository)
        {
            _serviceRepository = serviceRepository;
            _userRepository = userRepository;
        }

        public async Task<bool> Handle(DeleteFixedServiceCommand request, CancellationToken cancellationToken)
        {
            var user = (await _userRepository.ListAsync(cancellationToken))
                .FirstOrDefault(u => u.UserId == request.UserId);

            if (user == null)
                throw new InvalidOperationException("User not found");

            var service = await _serviceRepository.GetByIdAsync(request.ServiceId, cancellationToken);

            if (service == null)
                throw new InvalidOperationException("Service not found");

            if (service.UserId != user.Id)
                throw new InvalidOperationException("You don't have permission to delete this service");

            await _serviceRepository.Delete(service);
            return true;
        }
    }
}