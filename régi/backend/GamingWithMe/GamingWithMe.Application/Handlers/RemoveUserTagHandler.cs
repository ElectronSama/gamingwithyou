using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class RemoveUserTagHandler : IRequestHandler<RemoveUserTagCommand, bool>
    {
        private readonly IAsyncRepository<UserTag> _userTagRepository;
        private readonly IAsyncRepository<User> _userRepository;


        public RemoveUserTagHandler(IAsyncRepository<UserTag> userTagRepository, IAsyncRepository<User> userRepository)
        {
            _userTagRepository = userTagRepository;
            _userRepository = userRepository;
        }

        public async Task<bool> Handle(RemoveUserTagCommand request, CancellationToken cancellationToken)
        {
            var user = (await _userRepository.ListAsync(cancellationToken)).FirstOrDefault(x => x.UserId == request.UserId);
            if (user == null)
                return false;

            var existingItems = await _userTagRepository.ListAsync(cancellationToken);
            var userTag = existingItems.FirstOrDefault(ut => 
                ut.UserId == user.Id && ut.TagId == request.TagId);
            
            if (userTag == null)
                return false; 

            await _userTagRepository.Delete(userTag);
            return true;
        }
    }
}