using GamingWithMe.Application.Dtos;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Queries
{
    public record GetBookingByIdQuery(Guid Id) : IRequest<Booking?>;
    
}
