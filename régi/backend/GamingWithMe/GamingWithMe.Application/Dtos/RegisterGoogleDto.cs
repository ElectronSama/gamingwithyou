using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Dtos
{
    public record RegisterGoogleDto(
        [Required][EmailAddress] string email,
        [MinLength(6)] string password,
        [Required] string username,
        string googleId
        );
}
