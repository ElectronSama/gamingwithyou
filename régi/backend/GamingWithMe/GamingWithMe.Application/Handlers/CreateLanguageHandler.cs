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
    public class CreateLanguageHandler : IRequestHandler<CreateLanguageCommand, Guid>
    {
        private readonly IAsyncRepository<Language> _repo;

        public CreateLanguageHandler(IAsyncRepository<Language> repo)
        {
            _repo = repo;
        }
        public async Task<Guid> Handle(CreateLanguageCommand request, CancellationToken cancellationToken)
        {
            var lang = new Language { Name = request.language };

            await _repo.AddAsync(lang);

            return lang.Id;
        }
    }
}
