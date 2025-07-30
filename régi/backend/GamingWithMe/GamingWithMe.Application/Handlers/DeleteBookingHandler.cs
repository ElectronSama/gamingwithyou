using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class DeleteBookingHandler : IRequestHandler<DeleteBookingCommand, bool>
    {
        private readonly IAsyncRepository<Booking> _repo;

        public DeleteBookingHandler(IAsyncRepository<Booking> repo)
        {
            _repo = repo;
        }

        public async Task<bool> Handle(DeleteBookingCommand request, CancellationToken cancellationToken)
        {
            var booking = await _repo.GetByIdAsync(request.id);

            if (booking == null) { 
                throw new ArgumentNullException("No booking found");
            }

            await _repo.Delete(booking);

            return true;
        }
    }
}
