using GamingWithMe.Application.Interfaces;
using GamingWithMe.Application.Queries;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class GetAllLanguagesHandler : IRequestHandler<GetAllLanguagesQuery, IEnumerable<string>>
    {
        private readonly IAsyncRepository<Language> _repo;

        public GetAllLanguagesHandler(IAsyncRepository<Language> repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<string>> Handle(GetAllLanguagesQuery request, CancellationToken cancellationToken)
        {
            var langList = await _repo.ListAsync(cancellationToken);

            var langs = langList.Select(x => x.Name).ToList();

            return langs;
        }
    }
}
