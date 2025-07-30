using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Dtos
{
    public record ProductDto(string userId, string title, string description, long price, TimeSpan duration);
}
