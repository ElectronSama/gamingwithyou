using AutoMapper;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Domain.Entities;

namespace GamingWithMe.Application.Mappings
{
    public class FixedServiceProfile : Profile
    {
        public FixedServiceProfile()
        {
            CreateMap<FixedService, FixedServiceDto>()
                .ForMember(d => d.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(d => d.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(d => d.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(d => d.Price, opt => opt.MapFrom(src => src.Price))
                .ForMember(d => d.DeliveryDeadline, opt => opt.MapFrom(src => src.DeliveryDeadline))
                .ForMember(d => d.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(d => d.Username, opt => opt.MapFrom(src => src.User.Username))
                .ForMember(d => d.AvatarUrl, opt => opt.MapFrom(src => src.User.AvatarUrl))
                .ForMember(d => d.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt));

            CreateMap<CreateFixedServiceDto, FixedService>()
                .ForMember(d => d.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(d => d.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(d => d.Price, opt => opt.MapFrom(src => src.Price))
                .ForMember(d => d.DeliveryDeadline, opt => opt.MapFrom(src => src.DeliveryDeadline))
                .ForMember(d => d.Id, opt => opt.Ignore()) 
                .ForMember(d => d.Status, opt => opt.Ignore()) 
                .ForMember(d => d.UserId, opt => opt.Ignore())
                .ForMember(d => d.User, opt => opt.Ignore()) 
                .ForMember(d => d.CreatedAt, opt => opt.Ignore());
        }
    }
}