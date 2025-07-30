using AutoMapper;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Domain.Entities;

namespace GamingWithMe.Application.Mappings
{
    public class GameEasterEggProfile : Profile
    {
        public GameEasterEggProfile()
        {
            CreateMap<GameEasterEgg, GameEasterEggDto>()
                .ForMember(dest => dest.GameName, opt => opt.MapFrom(src => src.Game != null ? src.Game.Name : string.Empty));
        }
    }
}