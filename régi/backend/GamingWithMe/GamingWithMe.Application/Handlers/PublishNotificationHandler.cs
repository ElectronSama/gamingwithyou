using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class PublishNotificationHandler : IRequestHandler<PublishNotificationCommand, bool>
    {
        private readonly IAsyncRepository<Notification> _notificationRepository;

        public PublishNotificationHandler(IAsyncRepository<Notification> notificationRepository)
        {
            _notificationRepository = notificationRepository;
        }

        public async Task<bool> Handle(PublishNotificationCommand request, CancellationToken cancellationToken)
        {
            var notification = await _notificationRepository.GetByIdAsync(request.NotificationId, cancellationToken);
            if (notification == null)
            {
                return false;
            }

            notification.Publish();
            await _notificationRepository.Update(notification);

            return true;
        }
    }
}