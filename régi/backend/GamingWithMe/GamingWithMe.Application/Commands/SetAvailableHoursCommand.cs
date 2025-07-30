using GamingWithMe.Application.Dtos;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Commands
{
    public record SetAvailableHoursCommand(string userId, WeeklyHoursDto Hours) : IRequest<bool>;
}
