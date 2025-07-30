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
    public class DeleteServiceOrderHandler : IRequestHandler<DeleteServiceOrderCommand, bool>
    {
        private readonly IAsyncRepository<ServiceOrder> _orderRepository;

        public DeleteServiceOrderHandler(IAsyncRepository<ServiceOrder> orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<bool> Handle(DeleteServiceOrderCommand request, CancellationToken cancellationToken)
        {
            var order = await _orderRepository.GetByIdAsync(request.OrderId, cancellationToken);

            if (order == null)
                return false;

            await _orderRepository.Delete(order);
            return true;
        }
    }
}