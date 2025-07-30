using MediatR;

namespace GamingWithMe.Application.Commands
{
    public record UpdateSocialMediaCommand(
        string UserId,
        string? TwitterUrl,
        string? InstagramUrl,
        string? FacebookUrl
    ) : IRequest<bool>;
}