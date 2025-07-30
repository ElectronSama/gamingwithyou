using GamingWithMe.Application.Dtos;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;

namespace GamingWithMe.Application.Commands
{
    public class CreateGameEasterEggCommand : IRequest<GameEasterEggDto>
    {
        public Guid GameId { get; set; }
        public string Description { get; set; }
        public IFormFile ImageFile { get; set; }

        public CreateGameEasterEggCommand() { }

        public CreateGameEasterEggCommand(Guid gameId, string description, IFormFile imageFile)
        {
            GameId = gameId;
            Description = description;
            ImageFile = imageFile;
        }
    }
}