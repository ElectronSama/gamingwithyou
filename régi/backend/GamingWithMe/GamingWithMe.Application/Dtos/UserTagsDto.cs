using System;
using System.Collections.Generic;

namespace GamingWithMe.Application.Dtos
{
    public record UserTagsDto(Guid UserId, string Username, IEnumerable<TagDto> Tags);
}