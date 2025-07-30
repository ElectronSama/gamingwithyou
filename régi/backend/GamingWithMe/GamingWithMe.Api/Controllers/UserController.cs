using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Application.Queries;
using GamingWithMe.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Runtime.Intrinsics.X86;
using System.Security.Claims;
using static System.Reflection.Metadata.BlobBuilder;

namespace GamingWithMe.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IAsyncRepository<User> _userRepository;
        private readonly UserManager<IdentityUser> _userManager;

        public UserController(IMediator mediator, IAsyncRepository<User> userRepository, UserManager<IdentityUser> userManager)
        {
            _mediator = mediator;
            _userRepository = userRepository;
            _userManager = userManager;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized();
            }

            var user = (await _userRepository.ListAsync()).FirstOrDefault(u => u.UserId == userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            var identityUser = await _userManager.FindByIdAsync(userId);
            var isAdmin = identityUser != null && await _userManager.IsInRoleAsync(identityUser, "Admin");

            return Ok(new { id = user.Id, username = user.Username, isAdmin = isAdmin });
        }

        [HttpGet("billing-history")]
        public async Task<ActionResult<List<BillingRecordDto>>> GetBillingHistory()
        {
            var userId = GetUserId();
            var history = await _mediator.Send(new GetBillingHistoryQuery(userId));
            return Ok(history);
        }

        [HttpGet("upcoming-bookings")]
        public async Task<ActionResult<List<UpcomingBookingDto>>> GetUpcomingBookings()
        {
            var userId = GetUserId();
            var bookings = await _mediator.Send(new GetUpcomingBookingsQuery(userId));
            return Ok(bookings);
        }

        [HttpGet("profile/{username}")]
        [AllowAnonymous]
        public async Task<ActionResult<ProfileDto>> GetProfile(string username)
        {
            var profile = await _mediator.Send(new GetUserProfileQuery(username));

            return profile == null ? NotFound() : Ok(profile);
        }

        [HttpGet("profiles")]
        [AllowAnonymous]
        public async Task<ActionResult<List<ProfileDto>>> GetProfiles([FromQuery] string? tag = null, [FromQuery] int? top = null)
        {
            var profiles = await _mediator.Send(new GetUserProfilesQuery(tag, top));

            return profiles == null ? NotFound() : Ok(profiles);
        }

        [HttpGet("top-by-bookings")]
        [AllowAnonymous]
        public async Task<ActionResult<List<ProfileDto>>> GetTopByBookings()
        {
            var profiles = await _mediator.Send(new GetTopUsersByBookingsQuery());
            return profiles == null ? NotFound() : Ok(profiles);
        }

        [HttpGet("random-with-stripe")]
        [AllowAnonymous]
        public async Task<ActionResult<List<ProfileDto>>> GetRandomWithStripe()
        {
            var profiles = await _mediator.Send(new GetRandomUsersWithStripeQuery());
            return profiles == null ? NotFound() : Ok(profiles);
        }

        [HttpPut("bio")]
        public async Task<IActionResult> UpdateBio([FromBody] UpdateBioDto dto)
        {
            var userId = GetUserId();
            var result = await _mediator.Send(new UpdateUserBioCommand(userId, dto.Bio));
            return result ? Ok() : NotFound("User not found.");
        }

        [HttpPut("username")]
        public async Task<IActionResult> UpdateUsername([FromBody] UpdateUsernameDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username))
            {
                return BadRequest("Username is required.");
            }

            try
            {
                var userId = GetUserId();
                var result = await _mediator.Send(new UpdateUsernameCommand(userId, dto.Username));
                return result ? Ok("Username updated successfully.") : BadRequest("Failed to update username.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.CurrentPassword) || string.IsNullOrWhiteSpace(dto.NewPassword))
            {
                return BadRequest("Both current and new passwords are required.");
            }

            try
            {
                var userId = GetUserId();
                var result = await _mediator.Send(new ChangePasswordCommand(userId, dto.CurrentPassword, dto.NewPassword));
                return result ? Ok("Password changed successfully.") : BadRequest("Failed to change password.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("avatar")]
        public async Task<IActionResult> UpdateAvatar(IFormFile avatarFile)
        {
            if (avatarFile == null || avatarFile.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var userId = GetUserId();
            var newAvatarUrl = await _mediator.Send(new UpdateAvatarCommand(userId, avatarFile));

            return Ok(new { AvatarUrl = newAvatarUrl });
        }


        [HttpPost("languages/{languageName}")]
        public async Task<IActionResult> AddLanguage(string languageName)
        {
            var userId = GetUserId();

            var added = await _mediator.Send(new AddLanguageToUserByNameCommand(userId, languageName));

            return Ok(added);
        }

        [HttpDelete("languages/{languageName}")]
        public async Task<IActionResult> DeleteLanguage(string languageName)
        {
            var userId = GetUserId();

            var removed = await _mediator.Send(new DeleteLanguageFromUserCommand(userId, languageName));

            return Ok(removed);
        }

        [HttpPost("games/{gameName}")]
        public async Task<IActionResult> AddGame(string gameName)
        {
            var userId = GetUserId();

            var added = await _mediator.Send(new AddGameToUserByNameCommand(userId, gameName));

            return Ok(added);
        }

        [HttpDelete("games/{gameName}")]
        public async Task<IActionResult> DeleteGame(string gameName)
        {
            var userId = GetUserId();

            var removed = await _mediator.Send(new DeleteGameFromUserByNameCommand(userId, gameName));

            return Ok(removed);
        }



        [HttpPost("daily-availability")]
        public async Task<IActionResult> SetDailyAvailability([FromBody] DailyAvailabilityDto availability)
        {
            var userId = GetUserId();

            var result = await _mediator.Send(new SetDailyAvailabilityCommand(userId, availability));

            return result ? Ok(true) : BadRequest("Failed to set availability");
        }

        [HttpGet("daily-availability/{date}")]
        public async Task<IActionResult> GetDailyAvailability(DateTime date)
        {
            var userId = GetUserId();

            var availability = await _mediator.Send(new GetDailyAvailabilityQuery(userId, date));

            return Ok(availability);
        }

        [HttpGet("{username}/daily-availability/{date}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetUserDailyAvailability(string username, DateTime date)
        {
            var availability = await _mediator.Send(new GetUserDailyAvailabilityByUsernameQuery(username, date));

            return Ok(availability);
        }

        [HttpDelete("daily-availability/{date}/{startTime}")]
        public async Task<IActionResult> DeleteDailyAvailability(DateTime date, string startTime)
        {
            var userId = GetUserId();

            var result = await _mediator.Send(new DeleteDailyAvailabilityCommand(userId, date, startTime));

            return result ? Ok(true) : BadRequest("Failed to delete availability");
        }

        [HttpPost("tags/{tagName}")]
        public async Task<IActionResult> AddTag(string tagName)
        {
            var userId = GetUserId();
            var added = await _mediator.Send(new AddUserTagByNameCommand(userId, tagName));
            return added ? Ok(true) : BadRequest("Failed to add tag");
        }

        [HttpDelete("tags/{tagName}")]
        public async Task<IActionResult> RemoveTag(string tagName)
        {
            var userId = GetUserId();
            var removed = await _mediator.Send(new RemoveUserTagByNameCommand(userId, tagName));
            return removed ? Ok(true) : BadRequest("Failed to remove tag");
        }

        [HttpPut("social-media")]
        public async Task<IActionResult> UpdateSocialMedia([FromBody] UpdateSocialMediaDto dto)
        {
            try
            {
                var userId = GetUserId();
                var result = await _mediator.Send(new UpdateSocialMediaCommand(
                    userId,
                    dto.TwitterUrl,
                    dto.InstagramUrl,
                    dto.FacebookUrl));

                return result ? Ok("Social media links updated successfully.") : NotFound("User not found.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to update social media links: {ex.Message}");
            }
        }

        [HttpDelete("social-media/{platform}")]
        public async Task<IActionResult> DeleteSocialMediaLink(string platform)
        {
            try
            {
                var userId = GetUserId();

                var result = platform.ToLower() switch
                {
                    "twitter" or "x" => await _mediator.Send(new UpdateSocialMediaCommand(userId, null, null, null)),
                    "instagram" => await _mediator.Send(new UpdateSocialMediaCommand(userId, null, null, null)),
                    "facebook" => await _mediator.Send(new UpdateSocialMediaCommand(userId, null, null, null)),
                    _ => false
                };

                var user = (await _userRepository.ListAsync()).FirstOrDefault(u => u.UserId == userId);
                if (user == null) return NotFound("User not found.");

                switch (platform.ToLower())
                {
                    case "twitter":
                    case "x":
                        user.TwitterUrl = null;
                        break;
                    case "instagram":
                        user.InstagramUrl = null;
                        break;
                    case "facebook":
                        user.FacebookUrl = null;
                        break;
                    default:
                        return BadRequest("Invalid platform. Use 'twitter', 'instagram', or 'facebook'.");
                }

                await _userRepository.Update(user);
                return Ok($"{platform} link deleted successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to delete {platform} link: {ex.Message}");
            }
        }

        [HttpGet("social-media")]
        public async Task<IActionResult> GetSocialMediaLinks()
        {
            try
            {
                var userId = GetUserId();
                var user = (await _userRepository.ListAsync()).FirstOrDefault(u => u.UserId == userId);

                if (user == null) return NotFound("User not found.");

                return Ok(new
                {
                    TwitterUrl = user.TwitterUrl,
                    InstagramUrl = user.InstagramUrl,
                    FacebookUrl = user.FacebookUrl
                });
            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to retrieve social media links: {ex.Message}");
            }
        }


        private string GetUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                throw new Exception("User not found");
            }

            return userId;
        }
    }

    

    
}
