using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GamingWithMe.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public NotificationsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<NotificationDto>>> GetNotifications([FromQuery] bool isPublished = true)
        {
            var notifications = await _mediator.Send(new GetNotificationsQuery(isPublished));
            return Ok(notifications);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<NotificationDto>>> GetAllNotifications()
        {
            var notifications = await _mediator.Send(new GetAllNotificationsQuery());
            return Ok(notifications);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<NotificationDto>> CreateNotification([FromBody] CreateNotificationCommand command)
        {
            var notification = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetNotifications), new { id = notification.Id }, notification);
        }

        [HttpPut("{notificationId}/publish")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PublishNotification(Guid notificationId)
        {
            var result = await _mediator.Send(new PublishNotificationCommand(notificationId));
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpDelete("{notificationId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteNotification(Guid notificationId)
        {
            var result = await _mediator.Send(new DeleteNotificationCommand(notificationId));
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}