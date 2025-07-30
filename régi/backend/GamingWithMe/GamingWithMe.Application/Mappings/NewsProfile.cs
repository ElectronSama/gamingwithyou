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
    public sealed class NewsProfile : Profile
    {
        public NewsProfile()
        {
            CreateMap<GameNews, NewsDto>()
                .ForMember(dest => dest.game, opt => opt.MapFrom(src => src.Game.Name))
                .ForMember(dest => dest.title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.content, opt => opt.MapFrom(src => src.Content))
                .ForMember(dest => dest.publishedAt, opt => opt.MapFrom(src => src.PublishedAt));
        }
    }
}
