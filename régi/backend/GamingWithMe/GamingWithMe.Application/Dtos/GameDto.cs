using System;

namespace GamingWithMe.Application.Dtos
{
    public record GameDto(Guid Id, string Name, string Description, string Slug, string? ThumbnailUrl);
}
