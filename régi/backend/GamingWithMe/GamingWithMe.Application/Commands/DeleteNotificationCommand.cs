using MediatR;
using System;

namespace GamingWithMe.Application.Commands
{
    public record DeleteNotificationCommand(Guid NotificationId) : IRequest<bool>;
}