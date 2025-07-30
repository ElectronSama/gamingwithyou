using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GamingWithMe.Api.Controllers
{
    [Route("api/games/{gameId}/easter-eggs")]
    [ApiController]
    public class GameEasterEggsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public GameEasterEggsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<GameEasterEggDto>>> GetEasterEggs(Guid gameId)
        {
            var easterEggs = await _mediator.Send(new GetGameEasterEggsByGameIdQuery(gameId));
            return Ok(easterEggs);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<GameEasterEggDto>> CreateEasterEgg(Guid gameId, [FromForm] CreateGameEasterEggCommand command)
        {
            command.GameId = gameId;

            if (command.ImageFile == null || command.ImageFile.Length == 0)
            {
                return BadRequest("Image file is required.");
            }

            try
            {
                var result = await _mediator.Send(command);
                return CreatedAtAction(nameof(GetEasterEggs), new { gameId = gameId }, result);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{easterEggId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteEasterEgg(Guid gameId, Guid easterEggId)
        {
            var result = await _mediator.Send(new DeleteGameEasterEggCommand(easterEggId));
            
            if (!result)
            {
                return NotFound();
            }
            
            return NoContent();
        }
    }
}