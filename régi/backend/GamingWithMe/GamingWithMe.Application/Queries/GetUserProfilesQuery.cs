using GamingWithMe.Application.Dtos;
using MediatR;
using System.Collections.Generic;

namespace GamingWithMe.Application.Queries
{
    public record GetUserProfilesQuery(string? Tag = null, int? Top = null) : IRequest<List<ProfileDto>>;
}
