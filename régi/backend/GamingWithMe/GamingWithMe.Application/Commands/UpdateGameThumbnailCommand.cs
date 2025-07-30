using MediatR;
using Microsoft.AspNetCore.Http;
using System;

namespace GamingWithMe.Application.Commands
{
    public record UpdateGameThumbnailCommand(Guid GameId, IFormFile ThumbnailFile) : IRequest<string>;
}