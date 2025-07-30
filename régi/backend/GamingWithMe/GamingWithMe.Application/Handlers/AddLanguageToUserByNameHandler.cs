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
    public class AddLanguageToUserByNameHandler : IRequestHandler<AddLanguageToUserByNameCommand, bool>
    {
        private readonly IAsyncRepository<User> _userRepo;
        private readonly IAsyncRepository<Language> _languageRepo;

        public AddLanguageToUserByNameHandler(
            IAsyncRepository<User> userRepo,
            IAsyncRepository<Language> languageRepo)
        {
            _userRepo = userRepo;
            _languageRepo = languageRepo;
        }

        public async Task<bool> Handle(AddLanguageToUserByNameCommand request, CancellationToken cancellationToken)
        {
            var userList = await _userRepo.ListAsync(cancellationToken);
            var userFromList = userList.FirstOrDefault(x => x.UserId == request.UserId);
            
            if (userFromList is null)
                throw new InvalidOperationException("User not found");

            var user = await _userRepo.GetByIdAsync(userFromList.Id, cancellationToken, x => x.Languages);

            if (user is null)
                throw new InvalidOperationException("User not found");

            var language = (await _languageRepo.ListAsync(cancellationToken)).FirstOrDefault(x => x.Name.ToLower() == request.LanguageName.ToLower());
            if (language == null)
                throw new InvalidOperationException("Language not found.");

            var alreadyHasLanguage = user.Languages.Any(x => x.LanguageId == language.Id);

            if (!alreadyHasLanguage)
            {
                user.Languages.Add(new UserLanguage
                {
                    LanguageId = language.Id,
                    PlayerId = user.Id
                });
                
                await _userRepo.Update(user);
                return true;
            }

            return false; 
        }
    }
}