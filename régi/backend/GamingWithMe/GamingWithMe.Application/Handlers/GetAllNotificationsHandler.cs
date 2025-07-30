using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Application.Queries;
using GamingWithMe.Domain.Entities;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class GetAllNotificationsHandler : IRequestHandler<GetAllNotificationsQuery, List<NotificationDto>>
    {
        private readonly IAsyncRepository<Notification> _notificationRepository;

        public GetAllNotificationsHandler(IAsyncRepository<Notification> notificationRepository)
        {
            _notificationRepository = notificationRepository;
        }

        public async Task<List<NotificationDto>> Handle(GetAllNotificationsQuery request, CancellationToken cancellationToken)
        {
            var notifications = (await _notificationRepository.ListAsync(cancellationToken))
                                .OrderByDescending(n => n.CreatedAt)
                                .ToList();

            return notifications.Select(n => new NotificationDto(n.Id, n.Title, n.Content, n.CreatedAt, n.IsPublished)).ToList();
        }
    }
}