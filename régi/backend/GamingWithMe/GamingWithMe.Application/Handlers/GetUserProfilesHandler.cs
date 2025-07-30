using AutoMapper;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Application.Queries;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class GetUserProfilesHandler : IRequestHandler<GetUserProfilesQuery, List<ProfileDto>>
    {
        private readonly IAsyncRepository<User> _userRepo;
        private readonly IAsyncRepository<Language> _languageRepo;
        private readonly IAsyncRepository<Tag> _tagRepo;
        private readonly IMapper _mapper;

        public GetUserProfilesHandler(
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

        public async Task<List<ProfileDto>> Handle(GetUserProfilesQuery request, CancellationToken cancellationToken)
        {
            var users = await _userRepo.ListAsync(cancellationToken, 
                x => x.Languages, 
                x => x.Games, 
                x => x.Tags,
                x => x.DailyAvailability, 
                x => x.Products,
                x => x.Bookings);

            var allLanguages = await _languageRepo.ListAsync(cancellationToken);
            var allTags = await _tagRepo.ListAsync(cancellationToken);

            var languagesDict = allLanguages.ToDictionary(l => l.Id);
            var tagsDict = allTags.ToDictionary(t => t.Id);

            foreach (var user in users)
            {
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
            }

            var filteredUsers = users.AsEnumerable();
            if (!string.IsNullOrEmpty(request.Tag))
            {
                filteredUsers = users.Where(u => u.Tags.Any(ut => ut.Tag != null && ut.Tag.Name.Equals(request.Tag, StringComparison.OrdinalIgnoreCase)));
            }

            if (request.Top.HasValue && request.Top.Value > 0)
            {
                filteredUsers = filteredUsers.Take(request.Top.Value);
            }

            var profiles = new List<ProfileDto>();
            
            foreach (var user in filteredUsers)
            {
                var profile = _mapper.Map<ProfileDto>(user);
                profiles.Add(profile);
            }

            return profiles;
        }
    }
}
