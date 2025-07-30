using GamingWithMe.Application.Dtos;
using MediatR;

namespace GamingWithMe.Application.Commands
{
    public record CreateNotificationCommand(string Title, string Content) : IRequest<NotificationDto>;
}