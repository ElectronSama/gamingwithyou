using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class UpdateSocialMediaHandler : IRequestHandler<UpdateSocialMediaCommand, bool>
    {
        private readonly IAsyncRepository<User> _userRepository;

        public UpdateSocialMediaHandler(IAsyncRepository<User> userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<bool> Handle(UpdateSocialMediaCommand request, CancellationToken cancellationToken)
        {
            var user = (await _userRepository.ListAsync(cancellationToken))
                .FirstOrDefault(u => u.UserId == request.UserId);

            if (user == null)
            {
                return false;
            }

            user.TwitterUrl = string.IsNullOrWhiteSpace(request.TwitterUrl) ? null : request.TwitterUrl.Trim();
            user.InstagramUrl = string.IsNullOrWhiteSpace(request.InstagramUrl) ? null : request.InstagramUrl.Trim();
            user.FacebookUrl = string.IsNullOrWhiteSpace(request.FacebookUrl) ? null : request.FacebookUrl.Trim();

            await _userRepository.Update(user);
            return true;
        }
    }
}