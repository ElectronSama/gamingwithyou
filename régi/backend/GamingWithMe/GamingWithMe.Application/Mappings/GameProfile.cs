using AutoMapper;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Mappings
{
    public sealed class GameProfile : Profile
    {
        public GameProfile() {
            CreateMap<Game, GameDto>();
            CreateMap<GameDto, Game>()
                .ForMember(x => x.Slug, opt => opt.Ignore())
                .ForMember(x => x.ThumbnailUrl, opt => opt.Ignore());
        }
    }
}
