using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class DeleteLanguageFromGamerHandler : IRequestHandler<DeleteLanguageFromUserCommand, bool>
    {
        private readonly IAsyncRepository<User> _userRepo;
        private readonly IAsyncRepository<Language> _languageRepo;

        public DeleteLanguageFromGamerHandler(
            IAsyncRepository<User> userRepo,
            IAsyncRepository<Language> languageRepo)
        {
            _userRepo = userRepo;
            _languageRepo = languageRepo;
        }

        public async Task<bool> Handle(DeleteLanguageFromUserCommand request, CancellationToken cancellationToken)
        {
            var userList = await _userRepo.ListAsync(cancellationToken);
            var userFromList = userList.FirstOrDefault(x => x.UserId == request.userId);

            if (userFromList is null)
                throw new InvalidOperationException("User not found");

            var user = await _userRepo.GetByIdAsync(userFromList.Id, cancellationToken, x => x.Languages);

            if (user is null)
                throw new InvalidOperationException("User not found");

            var language = (await _languageRepo.ListAsync(cancellationToken)).FirstOrDefault(x => x.Name.ToLower() == request.language.ToLower());
            if (language == null)
                throw new InvalidOperationException("Language not found.");

            var entry = user.Languages?.FirstOrDefault(x => x.LanguageId == language.Id);

            if (entry != null)
            {
                user.Languages.Remove(entry);
                await _userRepo.Update(user);
                return true;
            }

            return false;
        }
    }
}
