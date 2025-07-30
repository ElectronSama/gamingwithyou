using AutoMapper;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Domain.Entities;
using System.Linq;

namespace GamingWithMe.Application.Mappings
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<User, ProfileDto>()
                .ForMember(d => d.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(d => d.username, opt => opt.MapFrom(src => src.Username))
                .ForMember(d => d.avatarurl, opt => opt.MapFrom(src => src.AvatarUrl))
                .ForMember(d => d.bio, opt => opt.MapFrom(src => src.Bio))
                .ForMember(d => d.isActive, opt => opt.MapFrom(src => src.IsActive))
                .ForMember(d => d.languages, 
                    opt => opt.MapFrom(src => src.Languages.Select(l => l.Language.Name).ToList()))
                .ForMember(d => d.games, 
                    opt => opt.MapFrom(src => src.Games.Select(g => g.Gamename).ToList()))
                .ForMember(d => d.tags, 
                    opt => opt.MapFrom(src => src.Tags.Select(t => t.Tag.Name).ToList()))
                .ForMember(d => d.hasStripeAccount, 
                    opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.StripeAccount)))
                .ForMember(d => d.availability, 
                    opt => opt.MapFrom(src => src.DailyAvailability.Select(a => new AvailabilitySlotDto(
                        a.Id, a.Date, a.StartTime.ToString(@"hh\:mm"), 
                        a.StartTime.Add(a.Duration).ToString(@"hh\:mm"), a.IsAvailable, a.Price
                    )).ToList()))
                .ForMember(d => d.joined, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(d => d.twitterUrl, opt => opt.MapFrom(src => src.TwitterUrl))
                .ForMember(d => d.instagramUrl, opt => opt.MapFrom(src => src.InstagramUrl))
                .ForMember(d => d.facebookUrl, opt => opt.MapFrom(src => src.FacebookUrl));
            
            CreateMap<Booking, BookingSummaryDto>()
                .ForMember(d => d.CustomerName, opt => opt.MapFrom(src => src.Customer.Username));
            
            CreateMap<UserAvailability, AvailabilitySlotDto>()
                .ForMember(d => d.StartTime, opt => opt.MapFrom(src => src.StartTime.ToString(@"hh\:mm")))
                .ForMember(d => d.EndTime, opt => opt.MapFrom(src => src.StartTime.Add(src.Duration).ToString(@"hh\:mm")));

        }
    }
}
