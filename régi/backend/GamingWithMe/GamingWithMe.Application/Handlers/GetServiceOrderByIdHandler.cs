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
    public class GetServiceOrderByIdHandler : IRequestHandler<GetServiceOrderByIdQuery, ServiceOrder?>
    {
        private readonly IAsyncRepository<ServiceOrder> _orderRepository;

        public GetServiceOrderByIdHandler(IAsyncRepository<ServiceOrder> orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<ServiceOrder?> Handle(GetServiceOrderByIdQuery request, CancellationToken cancellationToken)
        {
            var order = await _orderRepository.GetByIdAsync(request.Id, cancellationToken, 
                o => o.Service, 
                o => o.Customer, 
                o => o.Provider);

            if (order == null)
            {
                throw new InvalidOperationException("Service order not found");
            }

            return order;
        }
    }
}