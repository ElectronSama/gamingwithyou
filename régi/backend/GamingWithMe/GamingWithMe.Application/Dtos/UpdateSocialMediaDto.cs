using System.ComponentModel.DataAnnotations;

namespace GamingWithMe.Application.Dtos
{
    public class UpdateSocialMediaDto
    {
        [Url(ErrorMessage = "Please enter a valid Twitter/X URL")]
        public string? TwitterUrl { get; set; }

        [Url(ErrorMessage = "Please enter a valid Instagram URL")]
        public string? InstagramUrl { get; set; }

        [Url(ErrorMessage = "Please enter a valid Facebook URL")]
        public string? FacebookUrl { get; set; }
    }
}