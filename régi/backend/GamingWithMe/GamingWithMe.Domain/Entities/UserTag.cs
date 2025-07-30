using System;

namespace GamingWithMe.Domain.Entities
{
    public class UserTag
    {
        public Guid UserId { get; set; }
        public virtual User User { get; set; }
        public Guid TagId { get; set; }
        public virtual Tag Tag { get; set; }
        
        public UserTag() { }
    }
}