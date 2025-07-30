using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GamingWithMe.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly IMediator _mediator;

        public GameController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{gameSlug}")]
        public async Task<ActionResult<GameDto>> GetBySlug(string gameSlug)
        {
            var query = new GetGameBySlugQuery(gameSlug);
            var result = await _mediator.Send(query);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GameDto>>> GetAll()
        {
            var games = await _mediator.Send(new GetAllGamesQuery());
            return Ok(games);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateGame([FromBody] GameDto gameDto)
        {
            var command = new CreateGameCommand(gameDto);

            var gameId = await _mediator.Send(command);
            var createdGame = await _mediator.Send(new GetGameByIdQuery(gameId));

            if (createdGame == null)
            {
                return NotFound();
            }

            return CreatedAtAction(nameof(GetBySlug), new { gameSlug = createdGame.Slug }, createdGame);
        }

        [HttpPut("{gameId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateGame(Guid gameId, [FromBody] GameDto gameDto)
        {
            var command = new UpdateGameCommand(gameId, gameDto);
            var result = await _mediator.Send(command);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpPost("{gameId}/thumbnail")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadThumbnail(Guid gameId, IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var command = new UpdateGameThumbnailCommand(gameId, file);
            var thumbnailUrl = await _mediator.Send(command);

            return Ok(new { thumbnailUrl });
        }
    }
}
