using MediatR;
using Microsoft.AspNetCore.Http;

namespace GamingWithMe.Application.Commands
{
    public record UpdateAvatarCommand(string UserId, IFormFile AvatarFile) : IRequest<string>;
}