using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class CreateNotificationHandler : IRequestHandler<CreateNotificationCommand, NotificationDto>
    {
        private readonly IAsyncRepository<Notification> _notificationRepository;

        public CreateNotificationHandler(IAsyncRepository<Notification> notificationRepository)
        {
            _notificationRepository = notificationRepository;
        }

        public async Task<NotificationDto> Handle(CreateNotificationCommand request, CancellationToken cancellationToken)
        {
            var notification = new Notification(request.Title, request.Content);

            await _notificationRepository.AddAsync(notification, cancellationToken);

            return new NotificationDto(notification.Id, notification.Title, notification.Content, notification.CreatedAt, notification.IsPublished);
        }
    }
}