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
    public class UpdateFixedServiceHandler : IRequestHandler<UpdateFixedServiceCommand, bool>
    {
        private readonly IAsyncRepository<FixedService> _serviceRepository;
        private readonly IAsyncRepository<User> _userRepository;

        public UpdateFixedServiceHandler(IAsyncRepository<FixedService> serviceRepository, IAsyncRepository<User> userRepository)
        {
            _serviceRepository = serviceRepository;
            _userRepository = userRepository;
        }

        public async Task<bool> Handle(UpdateFixedServiceCommand request, CancellationToken cancellationToken)
        {
            var user = (await _userRepository.ListAsync(cancellationToken))
                .FirstOrDefault(u => u.UserId == request.UserId);

            if (user == null)
                throw new InvalidOperationException("User not found");

            var service = await _serviceRepository.GetByIdAsync(request.ServiceId, cancellationToken);

            if (service == null)
                throw new InvalidOperationException("Service not found");

            if (service.UserId != user.Id)
                throw new InvalidOperationException("You don't have permission to update this service");

            service.Title = request.Title;
            service.Description = request.Description;
            service.Status = request.Status;

            await _serviceRepository.Update(service);
            return true;
        }
    }
}