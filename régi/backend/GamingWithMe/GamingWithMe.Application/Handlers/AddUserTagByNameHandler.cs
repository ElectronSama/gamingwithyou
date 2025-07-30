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
    public class AddUserTagByNameHandler : IRequestHandler<AddUserTagByNameCommand, bool>
    {
        private readonly IAsyncRepository<User> _userRepo;
        private readonly IAsyncRepository<Tag> _tagRepo;

        public AddUserTagByNameHandler(
            IAsyncRepository<User> userRepo,
            IAsyncRepository<Tag> tagRepo)
        {
            _userRepo = userRepo;
            _tagRepo = tagRepo;
        }

        public async Task<bool> Handle(AddUserTagByNameCommand request, CancellationToken cancellationToken)
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

            var alreadyHasTag = user.Tags.Any(x => x.TagId == tag.Id);

            if (!alreadyHasTag)
            {
                user.Tags.Add(new UserTag
                {
                    TagId = tag.Id,
                    UserId = user.Id
                });
                
                await _userRepo.Update(user);
                return true;
            }

            return false;
        }
    }
}