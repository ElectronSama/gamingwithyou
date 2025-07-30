using AutoMapper;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Application.Queries;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class GetUserProfileHandler : IRequestHandler<GetUserProfileQuery, ProfileDto?>
    {
        private readonly IAsyncRepository<User> _userRepo;
        private readonly IAsyncRepository<Language> _languageRepo;
        private readonly IAsyncRepository<Tag> _tagRepo;
        private readonly IMapper _mapper;

        public GetUserProfileHandler(
            IAsyncRepository<User> userRepo,
            IAsyncRepository<Language> languageRepo,
            IAsyncRepository<Tag> tagRepo,
            IMapper mapper)
        {
            _userRepo = userRepo;
            _languageRepo = languageRepo;
            _tagRepo = tagRepo;
            _mapper = mapper;
        }

        public async Task<ProfileDto?> Handle(GetUserProfileQuery request, CancellationToken cancellationToken)
        {
            var user = (await _userRepo.ListAsync(cancellationToken,
                u => u.Languages,
                u => u.Games,
                u => u.Tags,
                u => u.DailyAvailability,
                u => u.Products
                )).FirstOrDefault(x => x.Username == request.username);

            if (user == null)   
            {
                return null;
            }

            var allLanguages = await _languageRepo.ListAsync(cancellationToken);
            var allTags = await _tagRepo.ListAsync(cancellationToken);

            var languagesDict = allLanguages.ToDictionary(l => l.Id);
            var tagsDict = allTags.ToDictionary(t => t.Id);

            foreach (var ul in user.Languages)
            {
                if (languagesDict.TryGetValue(ul.LanguageId, out var lang))
                    ul.Language = lang;
            }

            foreach (var ut in user.Tags)
            {
                if (tagsDict.TryGetValue(ut.TagId, out var tag))
                    ut.Tag = tag;
            }

            return _mapper.Map<ProfileDto>(user);
        }
    }
}
