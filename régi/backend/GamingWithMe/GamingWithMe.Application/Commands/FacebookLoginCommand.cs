using GamingWithMe.Application.Dtos;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Commands
{
    public class FacebookLoginCommand : IRequest<UserDto>
    {
        public string FacebookId { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
    }
}