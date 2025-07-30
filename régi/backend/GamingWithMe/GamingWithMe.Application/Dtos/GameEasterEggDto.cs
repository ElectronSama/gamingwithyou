using System;

namespace GamingWithMe.Application.Dtos
{
    public record GameEasterEggDto(
        string Description,
        string ImageUrl,
        string GameName
    );
}