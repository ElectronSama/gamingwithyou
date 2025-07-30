using MediatR;

namespace GamingWithMe.Application.Commands
{
    public record AddLanguageToUserByNameCommand(string UserId, string LanguageName) : IRequest<bool>;
}