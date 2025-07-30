using System;
using System.Collections.Generic;

namespace GamingWithMe.Domain.Entities
{
    public class Tag
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public ICollection<UserTag> Users { get; set; }

        public Tag()
        {
            Users = new List<UserTag>();
        }

        public Tag(string name) : this()
        {
            Id = Guid.NewGuid();
            Name = name;
        }
    }
}
