using MediatR;

namespace GamingWithMe.Application.Commands
{
    public record ChangePasswordCommand(string UserId, string CurrentPassword, string NewPassword) : IRequest<bool>;
}