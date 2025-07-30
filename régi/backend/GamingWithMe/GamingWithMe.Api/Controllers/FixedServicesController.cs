using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Queries;
using GamingWithMe.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GamingWithMe.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FixedServicesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public FixedServicesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<FixedServiceDto>>> GetServices(
            [FromQuery] string? category = null,
            [FromQuery] Guid? userId = null)
        {
            var services = await _mediator.Send(new GetFixedServicesQuery(userId, category));
            return Ok(services);
        }

        [HttpGet("my-services")]
        [Authorize]
        public async Task<ActionResult<List<FixedServiceDto>>> GetMyServices()
        {
            var userId = GetUserId();
            var services = await _mediator.Send(new GetMyFixedServicesQuery(userId));
            return Ok(services);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Guid>> CreateService([FromBody] CreateFixedServiceDto serviceDto)
        {
            try
            {
                var userId = GetUserId();
                var serviceId = await _mediator.Send(new CreateFixedServiceCommand(userId, serviceDto));
                return CreatedAtAction(nameof(GetServiceById), new { id = serviceId }, serviceId);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<FixedServiceDto>> GetServiceById(Guid id)
        {
            var services = await _mediator.Send(new GetFixedServicesQuery());
            var service = services.FirstOrDefault(s => s.Id == id);
            
            if (service == null)
                return NotFound("Service not found");

            return Ok(service);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateService(Guid id, [FromBody] UpdateFixedServiceDto updateDto)
        {
            try
            {
                var userId = GetUserId();
                var success = await _mediator.Send(new UpdateFixedServiceCommand(
                    id, userId, updateDto.Title, updateDto.Description, updateDto.Status));
                
                if (!success)
                    return NotFound("Service not found");

                return Ok("Service updated successfully");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteService(Guid id)
        {
            try
            {
                var userId = GetUserId();
                var success = await _mediator.Send(new DeleteFixedServiceCommand(id, userId));
                
                if (!success)
                    return NotFound("Service not found");

                return Ok("Service deleted successfully");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("orders")]
        [Authorize]
        public async Task<ActionResult<List<ServiceOrderDto>>> GetMyOrders([FromQuery] bool asProvider = false)
        {
            var userId = GetUserId();
            var orders = await _mediator.Send(new GetServiceOrdersQuery(userId, asProvider));
            return Ok(orders);
        }

        [HttpPut("orders/{orderId}/status")]
        [Authorize]
        public async Task<IActionResult> UpdateOrderStatus(Guid orderId, [FromBody] UpdateServiceOrderStatusDto updateDto)
        {
            try
            {
                var userId = GetUserId();
                var success = await _mediator.Send(new UpdateServiceOrderStatusCommand(
                    orderId, userId, updateDto.Status, updateDto.ProviderNotes));
                
                if (!success)
                    return NotFound("Service order not found");

                return Ok(new { 
                    Message = "Service order status updated successfully",
                    Status = updateDto.Status.ToString(),
                    CompletedDate = updateDto.Status == OrderStatus.Completed ? DateTime.UtcNow : (DateTime?)null
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private string GetUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                throw new UnauthorizedAccessException("User not authenticated");
            return userId;
        }
    }

    public class UpdateFixedServiceDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ServiceStatus Status { get; set; }
    }
}