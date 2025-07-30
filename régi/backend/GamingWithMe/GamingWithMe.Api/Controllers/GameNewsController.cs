using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GamingWithMe.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class GameNewsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public GameNewsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<NewsDto>>> GetNewsForGame(Guid gameId)
        {
            var news = await _mediator.Send(new GetNewsForGameQuery(gameId));
            return Ok(news);
        }

        [HttpGet("{newsId}")]
        public async Task<ActionResult<NewsDto>> GetNewsById(Guid newsId)
        {
            var newsItem = await _mediator.Send(new GetNewsItemByIdQuery(newsId));
            
            if (newsItem == null)
            {
                return NotFound();
            }
            
            return Ok(newsItem);
        }

        [HttpPost]
        public async Task<ActionResult<NewsDto>> CreateNews([FromBody] CreateNewsItemCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                return CreatedAtAction(nameof(GetNewsById), new { newsId = result.publishedAt }, result);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{newsId}")]
        public async Task<ActionResult> DeleteNews(Guid newsId)
        {
            var result = await _mediator.Send(new DeleteNewsItemCommand(newsId));
            
            if (!result)
            {
                return NotFound();
            }
            
            return NoContent();
        }
    }
}
