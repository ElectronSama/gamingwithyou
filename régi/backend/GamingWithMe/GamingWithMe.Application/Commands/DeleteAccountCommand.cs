using MediatR;

namespace GamingWithMe.Application.Commands
{
    public class DeleteAccountCommand : IRequest<bool>
    {
        public string UserId { get; set; }

        public DeleteAccountCommand(string userId)
        {
            UserId = userId;
        }
    }
}