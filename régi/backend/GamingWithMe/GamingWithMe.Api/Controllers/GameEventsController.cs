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
    [Route("api/games/{gameId}/events")]
    [ApiController]
    public class GameEventsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public GameEventsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<GameEventDto>>> GetEvents(Guid gameId)
        {
            var events = await _mediator.Send(new GetGameEventsByGameIdQuery(gameId));
            return Ok(events);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<GameEventDto>> CreateEvent(Guid gameId, [FromBody] CreateGameEventCommand command)
        {
            if (gameId != command.GameId)
            {
                return BadRequest("GameId in URL must match GameId in request body");
            }

            try
            {
                var result = await _mediator.Send(command);
                return CreatedAtAction(nameof(GetEvents), new { gameId = gameId }, result);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{eventId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteEvent(Guid gameId, Guid eventId)
        {
            var result = await _mediator.Send(new DeleteGameEventCommand(eventId));
            
            if (!result)
            {
                return NotFound();
            }
            
            return NoContent();
        }
    }
}