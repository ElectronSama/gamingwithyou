using MediatR;
using System;

namespace GamingWithMe.Application.Commands
{
    public record PublishNotificationCommand(Guid NotificationId) : IRequest<bool>;
}