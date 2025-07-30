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
    public class GetServiceOrdersHandler : IRequestHandler<GetServiceOrdersQuery, List<ServiceOrderDto>>
    {
        private readonly IAsyncRepository<ServiceOrder> _orderRepository;
        private readonly IAsyncRepository<User> _userRepository;

        public GetServiceOrdersHandler(IAsyncRepository<ServiceOrder> orderRepository, IAsyncRepository<User> userRepository)
        {
            _orderRepository = orderRepository;
            _userRepository = userRepository;
        }

        public async Task<List<ServiceOrderDto>> Handle(GetServiceOrdersQuery request, CancellationToken cancellationToken)
        {
            var user = (await _userRepository.ListAsync(cancellationToken))
                .FirstOrDefault(u => u.UserId == request.UserId);

            if (user == null)
                return new List<ServiceOrderDto>();

            var orders = await _orderRepository.ListAsync(cancellationToken, 
                o => o.Service, 
                o => o.Customer, 
                o => o.Provider);

            var filteredOrders = request.AsProvider 
                ? orders.Where(o => o.ProviderId == user.Id)
                : orders.Where(o => o.CustomerId == user.Id);

            return filteredOrders
                .Select(o => new ServiceOrderDto(
                    o.Id,
                    o.ServiceId,
                    o.Service.Title,
                    o.Customer.Username,
                    o.Provider.Username,
                    o.Status,
                    o.OrderDate,
                    o.DeliveryDeadline,
                    o.CompletedDate,
                    o.Service.Price,
                    o.CustomerNotes,
                    o.ProviderNotes,
                    o.IsOverdue()
                ))
                .OrderByDescending(o => o.OrderDate)
                .ToList();
        }
    }
}