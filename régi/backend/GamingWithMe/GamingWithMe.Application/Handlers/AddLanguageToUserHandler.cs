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
    public class AddLanguageToUserHandler : IRequestHandler<AddLanguageToUserCommand, Guid>
    {
        private readonly IAsyncRepository<User> _playerRepo;
        private readonly IAsyncRepository<Language> _languageRepo;

        public AddLanguageToUserHandler(
            IAsyncRepository<User> playerRepo,
            IAsyncRepository<Language> languageRepo)
        {
            _playerRepo = playerRepo;
            _languageRepo = languageRepo;
        }


        public async Task<Guid> Handle(AddLanguageToUserCommand request, CancellationToken cancellationToken)
        {
            var player = (await _playerRepo.ListAsync(cancellationToken)).FirstOrDefault(x=> x.UserId == request.userId);

            if (player is null)
                throw new InvalidOperationException("Player not found");

            var language = await _languageRepo.GetByIdAsync(request.LanguageId, cancellationToken);
            if (language == null)
                throw new InvalidOperationException("Language not found.");

            var alreadyHasLanguage = player.Languages.Any(x=> x.LanguageId == language.Id);

            if (!alreadyHasLanguage) {
                player.Languages.Add(new UserLanguage
                {
                    LanguageId = request.LanguageId,
                    PlayerId = player.Id
                });
            }

            await _playerRepo.Update(player);

            return request.LanguageId;
        }
    }
}
