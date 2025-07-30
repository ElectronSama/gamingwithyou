using AutoMapper;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Domain.Entities;

namespace GamingWithMe.Application.Mappings
{
    public class GameEventProfile : Profile
    {
        public GameEventProfile()
        {
            CreateMap<GameEvent, GameEventDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.GameName, opt => opt.MapFrom(src => src.Game != null ? src.Game.Name : string.Empty));
        }
    }
}