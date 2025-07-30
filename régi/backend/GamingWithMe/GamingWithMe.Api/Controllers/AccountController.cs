using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.Facebook;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public AccountController(IMediator mediator, UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IEmailService emailService, IConfiguration configuration)
        {
            _mediator = mediator;
            _userManager = userManager;
            _signInManager = signInManager;
            _emailService = emailService;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto, CancellationToken cancellationToken)
        {
            var id = await _mediator.Send(new RegisterProfileCommand(dto), cancellationToken);
            return Ok("Account created");
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);
            return NoContent();
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                return Ok("If an account with this email exists and is confirmed, a password reset link has been sent.");

            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            var frontendUrl = /*_configuration["Frontend:BaseUrl"] ??*/ "https://localhost:7091";
            var resetLink = $"https://localhost:5173/reset-password?email={Uri.EscapeDataString(user.Email)}&token={encodedToken}";


            var emailVariables = new Dictionary<string, string>
            {
                { "reset_link", resetLink },
                {"request_time", DateTime.UtcNow.ToString() }
            };

            try
            {
                await _emailService.SendEmailAsync(
                    user.Email,
                    "Reset Your Password - GamingWithMe",
                    7178587, 
                    emailVariables
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send password reset email: {ex.Message}");
            }

            return Ok("If an account with this email exists and is confirmed, a password reset link has been sent.");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                return BadRequest("Error resetting password.");
            }

            try
            {
                ValidatePassword(dto.NewPassword);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }

            var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(dto.Token));
            var result = await _userManager.ResetPasswordAsync(user, decodedToken, dto.NewPassword);

            if (result.Succeeded)
            {
                try
                {
                    var emailVariables = new Dictionary<string, string>
                    {
                        { "user_email", user.Email },
                        { "username", user.UserName ?? user.Email },
                        { "reset_time", DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss") + " UTC" }
                    };

                    await _emailService.SendEmailAsync(
                        user.Email,
                        "Password Reset Successful - GamingWithMe",
                        6048163, 
                        emailVariables
                    );
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to send password reset confirmation email: {ex.Message}");
                }

                return Ok("Password has been reset successfully.");
            }

            var errors = result.Errors.Select(e => e.Description);
            return BadRequest(new
            {
                Message = "Error resetting password.",
                Errors = errors
            });
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not authenticated");
            }

            try
            {
                var command = new ChangePasswordCommand(userId, dto.CurrentPassword, dto.NewPassword);
                var result = await _mediator.Send(command);

                if (result)
                {
                    return Ok("Password changed successfully.");
                }

                return BadRequest("Failed to change password.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("delete")]
        [Authorize]
        public async Task<IActionResult> DeleteAccount()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            try
            {
                var command = new DeleteAccountCommand(userId);
                var result = await _mediator.Send(command);

                if (result)
                {
                    await _signInManager.SignOutAsync();
                    return Ok("Account deleted successfully.");
                }

                return BadRequest("Failed to delete account.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("login/google")]
        public IActionResult GoogleLogin([FromQuery] string returnUrl = "/")
        {
            var redirectUrl = Url.Action("GoogleResponse", "Account", new { ReturnUrl = returnUrl });
            var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet("login/google/callback")]
        public async Task<IActionResult> GoogleResponse([FromQuery] string returnUrl)
        {
            var authenticateResult = await HttpContext.AuthenticateAsync(IdentityConstants.ExternalScheme);

            if (!authenticateResult.Succeeded)
            {
                return BadRequest("Google authentication failed.");
            }

            var claims = authenticateResult.Principal.Claims;
            var googleId = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var fullName = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(googleId) || string.IsNullOrEmpty(email))
            {
                return BadRequest("Required claims missing from Google authentication.");
            }

            try
            {
                var command = new GoogleLoginCommand
                {
                    GoogleId = googleId,
                    Email = email,
                    FullName = fullName ?? email
                };

                var userDto = await _mediator.Send(command);

                if (userDto == null)
                {
                    return BadRequest("Failed to process Google login.");
                }

                var identityUser = await _userManager.FindByEmailAsync(email);
                if (identityUser != null)
                {
                    await _signInManager.SignInAsync(identityUser, isPersistent: false);
                }

                return Redirect("https://localhost:5173");
            }
            catch (Exception ex)
            {
                return BadRequest($"Google login failed: {ex.Message}");
            }
        }

       

        private void ValidatePassword(string password)
        {
            if (password.Length < 6)
                throw new InvalidOperationException("Password must be at least 6 characters long.");
            if (!Regex.IsMatch(password, @"[A-Z]"))
                throw new InvalidOperationException("Password must contain at least one uppercase letter.");
            if (!Regex.IsMatch(password, @"[a-z]"))
                throw new InvalidOperationException("Password must contain at least one lowercase letter.");
            if (!Regex.IsMatch(password, @"\d"))
                throw new InvalidOperationException("Password must contain at least one number.");
            if (!Regex.IsMatch(password, @"[\W_]"))
                throw new InvalidOperationException("Password must contain at least one special character.");
        }
    }
}