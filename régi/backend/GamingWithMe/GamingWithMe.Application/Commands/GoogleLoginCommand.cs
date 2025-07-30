using GamingWithMe.Application.Dtos;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Commands
{
    public class GoogleLoginCommand : IRequest<UserDto>
    {
        public string GoogleId { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
    }
}
