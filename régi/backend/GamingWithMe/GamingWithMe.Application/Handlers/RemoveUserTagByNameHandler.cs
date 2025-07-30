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
    public class RemoveUserTagByNameHandler : IRequestHandler<RemoveUserTagByNameCommand, bool>
    {
        private readonly IAsyncRepository<User> _userRepo;
        private readonly IAsyncRepository<Tag> _tagRepo;

        public RemoveUserTagByNameHandler(
            IAsyncRepository<User> userRepo,
            IAsyncRepository<Tag> tagRepo)
        {
            _userRepo = userRepo;
            _tagRepo = tagRepo;
        }

        public async Task<bool> Handle(RemoveUserTagByNameCommand request, CancellationToken cancellationToken)
        {
            var userList = await _userRepo.ListAsync(cancellationToken);
            var userFromList = userList.FirstOrDefault(x => x.UserId == request.UserId);

            if (userFromList is null)
                throw new InvalidOperationException("User not found");

            var user = await _userRepo.GetByIdAsync(userFromList.Id, cancellationToken, x => x.Tags);

            if (user is null)
                throw new InvalidOperationException("User not found");

            var tag = (await _tagRepo.ListAsync(cancellationToken)).FirstOrDefault(x => x.Name.ToLower() == request.TagName.ToLower());
            if (tag == null)
                throw new InvalidOperationException("Tag not found.");

            var entry = user.Tags?.FirstOrDefault(x => x.TagId == tag.Id);

            if (entry != null)
            {
                user.Tags.Remove(entry);
                await _userRepo.Update(user);
                return true;
            }

            return false;
        }
    }
}