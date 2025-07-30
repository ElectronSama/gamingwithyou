using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class UpdateUserBioHandler : IRequestHandler<UpdateUserBioCommand, bool>
    {
        private readonly IAsyncRepository<User> _userRepository;

        public UpdateUserBioHandler(IAsyncRepository<User> userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<bool> Handle(UpdateUserBioCommand request, CancellationToken cancellationToken)
        {
            var user = (await _userRepository.ListAsync(cancellationToken))
                .FirstOrDefault(u => u.UserId == request.UserId);

            if (user == null)
            {
                return false;
            }

            user.Bio = request.Bio;
            await _userRepository.Update(user);

            return true;
        }
    }
}