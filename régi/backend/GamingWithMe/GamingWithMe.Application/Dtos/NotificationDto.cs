using System;

namespace GamingWithMe.Application.Dtos
{
    public record NotificationDto(
        Guid Id,
        string Title,
        string Content,
        DateTime CreatedAt,
        bool IsPublished);
}